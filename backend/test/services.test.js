import { beforeEach, describe, expect, it, vi } from "vitest";

const { sendMail, verify, upload, destroy } = vi.hoisted(() => ({
    sendMail: vi.fn().mockResolvedValue({ messageId: "test-message" }),
    verify: vi.fn(),
    upload: vi.fn().mockResolvedValue({
        public_id: "blogs/cover-image",
        secure_url: "https://cdn.example/cover-image.jpg",
    }),
    destroy: vi.fn().mockResolvedValue({ result: "ok" }),
}));

vi.mock("nodemailer", () => ({
    default: {
        createTransport: vi.fn(() => ({ sendMail, verify })),
        getTestMessageUrl: vi.fn(() => undefined),
    },
}));

vi.mock("../src/config/cloudinary.config.js", () => ({
    default: { uploader: { upload, destroy } },
}));

import sendEmail from "../service/email.service.js";
import { deleteImage, uploadImage } from "../service/cloudinary.js";
import { sendOtpVerificationEmail } from "../utils/OtpVerificationEmail.utils.js";

describe("email service", () => {
    beforeEach(() => {
        sendMail.mockClear();
        verify.mockClear();
        sendMail.mockResolvedValue({ messageId: "test-message" });
    });

    it("sends the supplied email fields", async () => {
        await sendEmail("from@example.com", "to@example.com", "Subject", "Text", "<p>HTML</p>");

        expect(sendMail).toHaveBeenCalledWith({
            from: "from@example.com",
            to: "to@example.com",
            subject: "Subject",
            text: "Text",
            html: "<p>HTML</p>",
        });
    });

    it("builds and sends an OTP verification email", async () => {
        await sendOtpVerificationEmail("to@example.com", "123456");

        expect(sendMail).toHaveBeenCalledTimes(1);
        expect(sendMail.mock.calls[0][0]).toMatchObject({
            to: "to@example.com",
            subject: "OTP verification ",
            text: expect.stringContaining("test@example.com"),
            html: expect.stringContaining("123456"),
        });
    });
});

describe("Cloudinary service", () => {
    beforeEach(() => {
        upload.mockClear();
        destroy.mockClear();
        upload.mockResolvedValue({
            public_id: "blogs/cover-image",
            secure_url: "https://cdn.example/cover-image.jpg",
        });
        destroy.mockResolvedValue({ result: "ok" });
    });

    it("uploads an image with stable filename options", async () => {
        const publicId = await uploadImage("./image.jpg");

        expect(publicId).toEqual({
            storageKey: "blogs/cover-image",
            url: "https://cdn.example/cover-image.jpg",
            secure_url: "https://cdn.example/cover-image.jpg",
            public_id: "blogs/cover-image",
        });
        expect(upload).toHaveBeenCalledWith("./image.jpg", {
            use_filename: true,
            unique_filename: false,
            overwrite: true,
        });
    });

    it("deletes an image by public id", async () => {
        await deleteImage("blogs/cover-image");

        expect(destroy).toHaveBeenCalledWith("blogs/cover-image");
    });
});

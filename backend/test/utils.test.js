import { describe, expect, it } from "vitest";
import {
    AppError,
    BadRequestError,
    ConflictError,
    UnauthorizedRequestError,
    ValidationError,
} from "../utils/errorHandler.utils.js";
import { createHashOf } from "../service/hashing.service.js";
import { setJWTToken, validateJWTToken } from "../service/jwtauthenticationservice.js";
import { extractAssetIds, isTiptapDocument } from "../utils/assetContent.utils.js";
import {
    validateEmail,
    validateOtp,
    validatePassword,
    validateUsername,
} from "../validators/userAuth.validators.js";

describe("error utilities", () => {
    it("creates typed errors with status and code", () => {
        const error = new BadRequestError("invalid input", { field: "email" });

        expect(error).toBeInstanceOf(AppError);
        expect(error.status).toBe(400);
        expect(error.code).toBe("BAD_REQUEST");
        expect(error.details).toEqual({ field: "email" });
    });

    it("supports the main application error types", () => {
        expect(new UnauthorizedRequestError().status).toBe(401);
        expect(new ConflictError().status).toBe(409);
        expect(new ValidationError().status).toBe(422);
    });
});

describe("hashing service", () => {
    it("returns deterministic, non-plaintext hashes", () => {
        const firstHash = createHashOf("password");

        expect(firstHash).toHaveLength(64);
        expect(firstHash).toBe(createHashOf("password"));
        expect(firstHash).not.toBe("password");
        expect(createHashOf("different password")).not.toBe(firstHash);
    });
});

describe("JWT service", () => {
    it("round trips a signed payload", () => {
        const token = setJWTToken({ user_id: "user-1" }, "15m");

        expect(validateJWTToken(token)).toMatchObject({ user_id: "user-1" });
    });

    it("rejects a malformed token", () => {
        expect(() => validateJWTToken("not-a-token")).toThrow();
    });
});

describe("user validators", () => {
    it("normalizes valid email and username values", () => {
        expect(validateEmail("  person@example.com ")).toBe("person@example.com");
        expect(validateUsername(" Alice ")).toBe("alice");
        expect(validateOtp(" 123456 ")).toBe("123456");
    });

    it("rejects invalid credentials", () => {
        expect(() => validateEmail("invalid")).toThrow(ValidationError);
        expect(() => validateUsername("a-user")).toThrow(ValidationError);
        expect(() => validatePassword("weak")).toThrow(ValidationError);
        expect(() => validateOtp(" ")).toThrow(ValidationError);
    });
});

describe("Tiptap asset content utilities", () => {
    it("extracts unique image asset ids from nested content", () => {
        const content = {
            type: "doc",
            content: [
                { type: "paragraph", content: [{ type: "text", text: "hello" }] },
                { type: "image", attrs: { src: "a.jpg", assetId: "asset-a" } },
                { type: "blockquote", content: [
                    { type: "image", attrs: { src: "b.jpg", assetId: "asset-b" } },
                    { type: "image", attrs: { src: "a.jpg", assetId: "asset-a" } },
                ] },
            ],
        };

        expect(isTiptapDocument(content)).toBe(true);
        expect(extractAssetIds(content)).toEqual(["asset-a", "asset-b"]);
        expect(isTiptapDocument("<p>old html</p>")).toBe(false);
    });
});

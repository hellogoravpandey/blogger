import express, { Router } from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import { BadRequestError } from "../utils/errorHandler.utils.js";

describe("Express app", () => {
    it("parses JSON and mounts injected routers without opening a port", async () => {
        const authRouter = Router();
        authRouter.post("/echo", (req, res) => res.status(201).json(req.body));
        const app = createApp({ authRouter });

        const response = await request(app)
            .post("/api/auth/echo")
            .send({ value: "test" });

        expect(response.status).toBe(201);
        expect(response.body).toEqual({ value: "test" });
    });

    it("returns a structured error for unknown routes", async () => {
        const response = await request(createApp()).get("/missing");

        expect(response.status).toBe(404);
        expect(response.body).toMatchObject({
            code: "NOT_FOUND_REQUEST",
        });
    });

    it("maps thrown application errors to JSON responses", async () => {
        const router = Router();
        router.get("/failure", () => {
            throw new BadRequestError("invalid request");
        });
        const app = createApp({ authRouter: router });

        const response = await request(app).get("/api/auth/failure");

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message: "invalid request",
            code: "BAD_REQUEST",
            details: null,
        });
    });
});

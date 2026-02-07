import { describe, it, expect } from "vitest";
import {
  sanitizeAIOutput,
  containsDangerousContent,
  waitlistSchema,
  generationSchema,
} from "@/lib/validation";

describe("Validation Extended", () => {
  describe("sanitizeAIOutput", () => {
    it("should remove script tags", () => {
      const input = '<script>alert("xss")</script>Hello World';
      const result = sanitizeAIOutput(input);
      expect(result).not.toContain("<script");
      expect(result).not.toContain("</script>");
      expect(result).toContain("Hello World");
    });

    it("should remove style tags", () => {
      const input = "<style>body { color: red; }</style>Content";
      const result = sanitizeAIOutput(input);
      expect(result).not.toContain("<style");
      expect(result).toContain("Content");
    });

    it("should remove iframe tags", () => {
      const input = '<iframe src="https://evil.com"></iframe>';
      const result = sanitizeAIOutput(input);
      expect(result).not.toContain("<iframe");
    });

    it("should remove object tags", () => {
      const input = '<object data="evil.swf"></object>';
      const result = sanitizeAIOutput(input);
      expect(result).not.toContain("<object");
    });

    it("should remove embed tags", () => {
      const input = '<embed src="evil.swf">';
      const result = sanitizeAIOutput(input);
      expect(result).not.toContain("<embed");
    });

    it("should remove form tags", () => {
      const input = '<form action="https://evil.com"><input type="text"></form>';
      const result = sanitizeAIOutput(input);
      expect(result).not.toContain("<form");
      expect(result).not.toContain("<input");
    });

    it("should remove button tags", () => {
      const input = '<button onclick="alert(1)">Click me</button>';
      const result = sanitizeAIOutput(input);
      expect(result).not.toContain("<button");
    });

    it("should remove javascript: protocol", () => {
      const input = '<a href="javascript:alert(1)">Link</a>';
      const result = sanitizeAIOutput(input);
      expect(result).not.toContain("javascript:");
    });

    it("should remove vbscript: protocol", () => {
      const input = '<a href="vbscript:msgbox(1)">Link</a>';
      const result = sanitizeAIOutput(input);
      expect(result).not.toContain("vbscript:");
    });

    it("should remove data:text/html protocol", () => {
      const input = '<a href="data:text/html,<script>alert(1)</script>">Link</a>';
      const result = sanitizeAIOutput(input);
      expect(result).not.toContain("data:text/html");
    });

    it("should remove event handlers", () => {
      const input = '<div onload="alert(1)" onclick="alert(2)">Content</div>';
      const result = sanitizeAIOutput(input);
      expect(result).not.toContain("onload");
      expect(result).not.toContain("onclick");
    });

    it("should remove base64 encoded scripts", () => {
      const input = "data:image/svg+xml;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==";
      const result = sanitizeAIOutput(input);
      expect(result).not.toContain("base64");
    });

    it("should handle null bytes", () => {
      const input = "Hello\0World";
      const result = sanitizeAIOutput(input);
      expect(result).not.toContain("\0");
      expect(result).toBe("HelloWorld");
    });

    it("should remove zero-width characters", () => {
      const input = "Hello\u200BWorld\uFEFF";
      const result = sanitizeAIOutput(input);
      expect(result).toBe("HelloWorld");
    });

    it("should remove right-to-left override characters", () => {
      const input = "Hello\u202EWorld";
      const result = sanitizeAIOutput(input);
      expect(result).toBe("HelloWorld");
    });

    it("should handle SVG with scripts", () => {
      const input = "<svg><script>alert(1)</script></svg>";
      const result = sanitizeAIOutput(input);
      // SVG with scripts should be completely removed or sanitized
      expect(result).not.toContain("<script");
      expect(result).not.toContain("alert(1)");
    });

    it("should preserve safe SVG", () => {
      const input = '<svg><circle cx="50" cy="50" r="40"/></svg>';
      const result = sanitizeAIOutput(input);
      expect(result).toContain("<svg");
    });

    it("should handle empty input", () => {
      expect(sanitizeAIOutput("")).toBe("");
    });

    it("should handle non-string input", () => {
      expect(sanitizeAIOutput(null as unknown as string)).toBe("");
      expect(sanitizeAIOutput(undefined as unknown as string)).toBe("");
      expect(sanitizeAIOutput(123 as unknown as string)).toBe("");
    });

    it("should preserve safe HTML", () => {
      const input = "<p>Hello <strong>World</strong></p>";
      const result = sanitizeAIOutput(input);
      expect(result).toContain("<p>");
      expect(result).toContain("<strong>");
    });
  });

  describe("containsDangerousContent", () => {
    it("should detect script tags", () => {
      expect(containsDangerousContent("<script>alert(1)</script>")).toBe(true);
      expect(containsDangerousContent("<SCRIPT>alert(1)</SCRIPT>")).toBe(true);
    });

    it("should detect javascript: protocol", () => {
      expect(containsDangerousContent("javascript:alert(1)")).toBe(true);
      expect(containsDangerousContent("JaVaScRiPt:alert(1)")).toBe(true);
    });

    it("should detect vbscript: protocol", () => {
      expect(containsDangerousContent("vbscript:msgbox(1)")).toBe(true);
    });

    it("should detect event handlers", () => {
      expect(containsDangerousContent("onload=alert(1)")).toBe(true);
      expect(containsDangerousContent('onclick="evil()"')).toBe(true);
      expect(containsDangerousContent("onerror=alert(1)")).toBe(true);
    });

    it("should detect iframe", () => {
      expect(containsDangerousContent('<iframe src="evil.com">')).toBe(true);
    });

    it("should detect object tags", () => {
      expect(containsDangerousContent('<object data="evil.swf">')).toBe(true);
    });

    it("should detect embed tags", () => {
      expect(containsDangerousContent('<embed src="evil.swf">')).toBe(true);
    });

    it("should detect document.cookie access", () => {
      expect(containsDangerousContent("document.cookie")).toBe(true);
    });

    it("should detect document.location manipulation", () => {
      expect(containsDangerousContent("document.location")).toBe(true);
    });

    it("should detect document.write", () => {
      expect(containsDangerousContent("document.write")).toBe(true);
    });

    it("should detect window.location manipulation", () => {
      expect(containsDangerousContent("window.location")).toBe(true);
    });

    it("should detect window.open", () => {
      expect(containsDangerousContent("window.open")).toBe(true);
    });

    it("should detect eval", () => {
      expect(containsDangerousContent('eval("code")')).toBe(true);
    });

    it("should detect Function constructor", () => {
      expect(containsDangerousContent('Function("code")')).toBe(true);
    });

    it("should detect setTimeout with string", () => {
      expect(containsDangerousContent('setTimeout("code", 1000)')).toBe(true);
    });

    it("should detect setInterval with string", () => {
      expect(containsDangerousContent('setInterval("code", 1000)')).toBe(true);
    });

    it("should return false for safe content", () => {
      expect(containsDangerousContent("Hello World")).toBe(false);
      expect(containsDangerousContent("<p>Safe HTML</p>")).toBe(false);
      expect(containsDangerousContent("Normal text with: colons and . dots")).toBe(false);
    });

    it("should handle empty input", () => {
      expect(containsDangerousContent("")).toBe(false);
    });

    it("should handle null/undefined", () => {
      expect(containsDangerousContent(null as unknown as string)).toBe(false);
      expect(containsDangerousContent(undefined as unknown as string)).toBe(false);
    });
  });

  describe("waitlistSchema", () => {
    it("should validate valid email", () => {
      const result = waitlistSchema.safeParse({
        email: "test@example.com",
      });
      expect(result.success).toBe(true);
    });

    it("should reject invalid email", () => {
      const result = waitlistSchema.safeParse({
        email: "not-an-email",
      });
      expect(result.success).toBe(false);
    });

    it("should reject empty email", () => {
      const result = waitlistSchema.safeParse({
        email: "",
      });
      expect(result.success).toBe(false);
    });

    it("should reject email that is too long", () => {
      const result = waitlistSchema.safeParse({
        email: "a".repeat(250) + "@example.com",
      });
      expect(result.success).toBe(false);
    });

    it("should accept with source parameter", () => {
      const result = waitlistSchema.safeParse({
        email: "test@example.com",
        source: "homepage",
      });
      expect(result.success).toBe(true);
    });

    it("should reject source that is too long", () => {
      const result = waitlistSchema.safeParse({
        email: "test@example.com",
        source: "a".repeat(100),
      });
      expect(result.success).toBe(false);
    });

    it("should use default source", () => {
      const result = waitlistSchema.safeParse({
        email: "test@example.com",
      });
      if (result.success) {
        expect(result.data.source).toBe("homepage");
      }
    });
  });

  describe("generationSchema", () => {
    it("should validate valid generation request", () => {
      const result = generationSchema.safeParse({
        transcriptId: "550e8400-e29b-41d4-a716-446655440000",
        format: "blog-article",
        length: "medium",
      });
      expect(result.success).toBe(true);
    });

    it("should validate all formats", () => {
      const formats = ["social-post", "blog-article", "newsletter", "summary"];
      formats.forEach((format) => {
        const result = generationSchema.safeParse({
          transcriptId: "550e8400-e29b-41d4-a716-446655440000",
          format,
          length: "medium",
        });
        expect(result.success).toBe(true);
      });
    });

    it("should validate all lengths", () => {
      const lengths = ["short", "medium", "long"];
      lengths.forEach((length) => {
        const result = generationSchema.safeParse({
          transcriptId: "550e8400-e29b-41d4-a716-446655440000",
          format: "blog-article",
          length,
        });
        expect(result.success).toBe(true);
      });
    });

    it("should reject invalid format", () => {
      const result = generationSchema.safeParse({
        transcriptId: "550e8400-e29b-41d4-a716-446655440000",
        format: "invalid-format",
        length: "medium",
      });
      expect(result.success).toBe(false);
    });

    it("should reject invalid length", () => {
      const result = generationSchema.safeParse({
        transcriptId: "550e8400-e29b-41d4-a716-446655440000",
        format: "blog-article",
        length: "extra-long",
      });
      expect(result.success).toBe(false);
    });

    it("should reject invalid UUID", () => {
      const result = generationSchema.safeParse({
        transcriptId: "not-a-uuid",
        format: "blog-article",
        length: "medium",
      });
      expect(result.success).toBe(false);
    });

    it("should accept optional tone", () => {
      const result = generationSchema.safeParse({
        transcriptId: "550e8400-e29b-41d4-a716-446655440000",
        format: "blog-article",
        length: "medium",
        tone: "professional",
      });
      expect(result.success).toBe(true);
    });

    it("should reject tone that is too long", () => {
      const result = generationSchema.safeParse({
        transcriptId: "550e8400-e29b-41d4-a716-446655440000",
        format: "blog-article",
        length: "medium",
        tone: "a".repeat(101),
      });
      expect(result.success).toBe(false);
    });

    it("should accept optional customPrompt", () => {
      const result = generationSchema.safeParse({
        transcriptId: "550e8400-e29b-41d4-a716-446655440000",
        format: "blog-article",
        length: "medium",
        customPrompt: "Make it more engaging",
      });
      expect(result.success).toBe(true);
    });

    it("should reject customPrompt that is too long", () => {
      const result = generationSchema.safeParse({
        transcriptId: "550e8400-e29b-41d4-a716-446655440000",
        format: "blog-article",
        length: "medium",
        customPrompt: "a".repeat(5001),
      });
      expect(result.success).toBe(false);
    });
  });
});

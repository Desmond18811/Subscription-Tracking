import aj from "../config/arject.js";

const arjectMiddleware = async (req, res, next) => {
    try {
        const decision = await aj.protect(req, {requested: 5}); // Deduct 5 tokens from the bucket
        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                res.status(429).json({ error: "Too Many Requests" });
            } else if (decision.reason.isBot()) {
                res.status(403).json({ error: "No bots allowed" });
            } else {
                res.status(403).json({ error: "Forbidden" });
            }
            return;
        }
        next(); // Proceed to the next middleware or route handler
    }  catch (error) {
            console.error("Error in Arcjet middleware:", error);
            res.status(500).json({ error: "Internal Server Error" });
            return;
        }
}

export default arjectMiddleware;
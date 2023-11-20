
export const getSide = () =>
    typeof window === "undefined" ? "server" : "client";

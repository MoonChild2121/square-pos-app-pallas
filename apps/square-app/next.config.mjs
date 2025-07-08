// next.config.mjs
import MillionLint from "@million/lint";

const nextConfig = {
  reactStrictMode: true,
};

export default MillionLint.next({ rsc: true })(nextConfig);

import million from 'million/compiler'

const nextConfig = {
  reactStrictMode: true,
}

const millionConfig = {
  // if you're using RSC:
  auto: { rsc: true },
}

export default million.next(nextConfig, millionConfig)

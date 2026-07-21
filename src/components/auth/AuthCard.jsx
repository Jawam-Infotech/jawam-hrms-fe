function AuthCard({ children }) {
  return (
    <section className="relative z-10 ml-0 flex min-h-[780px] translate-y-5 animate-login-card flex-col items-center rounded-[24px] border-2 border-[#c8c8c8] bg-white px-[56px] pt-[48px] pb-[52px] opacity-0 max-[1220px]:ml-0 max-[1220px]:min-h-0 max-[1220px]:px-8 max-[1220px]:pt-12 max-[1220px]:pb-14 max-[760px]:rounded-3xl max-[760px]:px-5 max-[760px]:pt-10 max-[760px]:pb-[42px] max-[380px]:px-4 max-[380px]:pt-[34px] max-[380px]:pb-9">
      {children}
    </section>
  )
}

export default AuthCard

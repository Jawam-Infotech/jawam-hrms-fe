import LogoMark from './LogoMark.jsx'

function AuthHeader({ title, subtitle }) {
  return (
    <>
      <LogoMark />

      <div className="mt-[40px] text-center max-[760px]:mt-11">
        <h1 className="m-0 text-[48px] leading-[1.08] font-black tracking-normal max-[760px]:text-[34px] max-[380px]:text-[30px]">{title}</h1>
        <p className="mt-2 mb-0 text-[28px] font-extrabold text-[#4b5563] max-[760px]:text-xl">{subtitle}</p>
      </div>
    </>
  )
}

export default AuthHeader

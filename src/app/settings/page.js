export default function Settings() {
  return (
    <div className="relative min-h-screen bg-black/50">
      <div className="absolute inset-0 rounded-[1280px] bg-[#669C7D] blur-[375px] opacity-35"></div>
      <p className="text-white p-8 text-[20px]">SETTINGS</p>
      <div className="flex justify-center">
      <form className="mt-30 w-2xl h-119.5 flex flex-col justify-center rounded-[25px] bg-[rgba(255,255,255,0.10)] backdrop-blur-md border border-white/30 inset-shadow-sm/30 shadow-xl p-8 gap-6">
      <h1 className="text-[24px]">ADD NEW ADMIN</h1>
      <label className="text-[20px]">Name</label>
      <input className="rounded-[15px] bg-[#D9D9D9]/30 w-129 h-12 text-[15px] p-4" type="text" placeholder="Enter Name"></input>
      <label className="text-[20px]">Email Address</label>
      <input className="rounded-[15px] bg-[#D9D9D9]/30 w-129 h-12 text-[15px] p-4" type="email" placeholder="Enter Email Address"></input>
      <button className="bg-[#0CAC4F]/50 rounded-[25px] w-48 h-11.25 self-center mt-4">ADD ADMIN</button>
      </form>
      </div>
    </div>
  );
}

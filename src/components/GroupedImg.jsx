
// export default function GroupedImg() {
//     return (
//         <div className="relative ">
//             <img src="./images/mask_group.png" alt="plant image" className="relative max-w-[400px] w-full select-none" />
//             <img src="./images/logo.svg" alt="" className="w-18 relative bottom-20 left-53 select-none" />
//             <h4 className="text-5xl absolute top-31 left-1 flex gap-6 font-semibold select-none font-sans">For The <span className="text-white">Change</span></h4>
//         </div>
//     );
// }

export default function GroupedImg() {
  return (
    <div className="relative flex flex-col items-center text-center">
      <img
        src="./images/mask_group.png"
        alt="Support change"
        className="max-w-sm w-full select-none"
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <img
          src="./images/logo.svg"
          alt="Swastik Srijan Foundation"
          className="w-20 mb-4"
        />
        <h4 className="text-3xl md:text-4xl font-bold text-zinc-900">
          For The <span className="text-[#003366]">Change</span>
        </h4>
      </div>
    </div>
  );
}

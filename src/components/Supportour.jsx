import Heart from "../assets/Heart.png";
import QRcode from "../assets/QR.png";
import { IoCopyOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import Barcode from "../assets/barcode.jpg";
function Supportour() {
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("copied!");
  };
  return (
    <div className="w-full min-h-screen pt-10 pb-20 bg-black flex flex-col items-center justify-center px-4">
      <div className="w-full  flex flex-col gap-4 justify-center items-center">
        <Toaster
          toastOptions={{
            className:
              " font-semibold text-lg px-4 py-2 text-white bg-[#003366] cursor-pointer transition-all duration-200 ease-in z-2 mt-20",
            style: {
              padding: "12px 20px",
              background: "#003366",
              color: "white",
              borderRadius: "0",
            },
          }}
          position="top-center"
          reverseOrder={false}
        />
        <div className="flex">
          <p className=" text-3xl lg:text-5xl gap-4 text-white font-bold flex items-center">
            <span>
              {" "}
              <img src={Heart} className=""></img>
            </span>
            <i>Support Our Cause</i>
          </p>
        </div>
        <p className="text-zinc-500 font-semibold text-center">
          Your contribution supports education, women empowerment, health &
          rural development
        </p>
      </div>

      <div className="flex flex-col rounded-sm lg:flex-row items-center justify-evenly bg-white w-full max-w-[450px] lg:max-w-[980px] mx-auto mt-10 p-4 gap-10 pb-12">
        {/* Left Section */}
        <div className="flex flex-col items-center gap-4">
          {/* Heading */}
          <span className="text-center text-zinc-600 text-lg font-medium">
            Scan To Pay
          </span>

          {/* QR Box */}
          <div className="flex flex-col items-center justify-center bg-[#003366]/10 p-6 rounded border border-dashed w-full max-w-[420px]">
            <img src={Barcode} className="w-40 h-40" />

            {/* UPI ID */}
            <div className="flex items-center gap-2 bg-white px-4 py-2 mt-4  shadow-[4px_4px_0px_#003366] w-fit">
              <span>swastikstijanfoundation@ptyes</span>

              <span
                className="text-[#003366] cursor-pointer ml-6 flex items-center gap-1"
                onClick={() => handleCopy("swastiksrijanfoundation@ptyes")}
              >
                Copy <IoCopyOutline />
              </span>
            </div>
          </div>
        </div>
        <div className="hidden lg:block w-px h-[250px] mt-8 bg-zinc-400"></div>
        <div className="flex flex-col items-center justify-center w-full lg:max-w-[320px]">
          <span className="text-zinc-600 text-center text-lg font-medium">
            Bank Transfer (NEFT/IMPS)
          </span>

          <div className="space-y-6 w-full mt-10">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-zinc-400">Bank Name</span>
              <div className="flex items-center gap-2">
                <span className="text-zinc-600 font-medium">
                  Union Bank Of India
                </span>
                <span
                  className="text-[#003366] cursor-pointer"
                  onClick={() => handleCopy("Union Bank Of India")}
                >
                  <IoCopyOutline />
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-zinc-400">Account No.</span>
              <div className="flex items-center gap-2">
                <span className="text-zinc-600 font-medium">
                  481401010036579
                </span>
                <span
                  className="text-[#003366] cursor-pointer"
                  onClick={() => handleCopy("481401010036579")}
                >
                  <IoCopyOutline />
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-zinc-400">IFSC Code</span>
              <div className="flex items-center gap-2">
                <span className="text-zinc-600 font-medium">UBIN0548146</span>
                <span
                  className="text-[#003366] cursor-pointer"
                  onClick={() => handleCopy("UBIN0548146")}
                >
                  <IoCopyOutline />
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-zinc-400">Branch</span>
              <div className="flex items-center gap-2">
                <span className="text-zinc-600 font-medium">
                  Transport Nagar, Rewa
                </span>
                <span
                  className="text-[#003366] cursor-pointer"
                  onClick={() => handleCopy("Transport Nagar, Rewa")}
                >
                  <IoCopyOutline />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Supportour;

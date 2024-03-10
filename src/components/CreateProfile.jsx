import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";


const apiUrl = process.env.REACT_APP_API_URL;

const CreateProfile = () => {
  const [userName, setUserName] = useState("");
  const [imgURL, setImgURL] = useState("");
  const [isPending, setIsPending] = useState(false);
  const { publicKey } = useWallet();

  const submitCode = async (e) => {
    e.preventDefault();
    setIsPending(true);
    await checkifprofileExists();
  }

  const checkifprofileExists = async () => {
    try {
      const response = await axios.get(`${apiUrl}/check-profile`, {
        params: {
          key: publicKey?.toString(),
        }
      });
      if (response.data.status === 200) {
        alert("Connected Wallet already has a profile");
        setIsPending(false);
      } else {
        await createProfile();
      }
    } catch (error) {
      alert(error);
    }
  }
  const createProfile = async () => {
    try {
      await axios.post(`${apiUrl}/create-profile`, {
        key: publicKey?.toString(),
        username: userName,
        imageurl: imgURL,
      });
      alert("Profile created successfully");
      setIsPending(false);
      window.location.reload();
    } catch (error) {
      alert(error);
    }
  }
  return ( 
    <div className="mt-8 w-full sm:w-full md:w-[30rem] lg:max-w-md px-4">
      <div className="bg-gray-800 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
        <div className="sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-3xl font-extrabold text-white text-center">
            Create profile
          </h2>
        </div>
        <form onSubmit={submitCode}>
          <div>
            <label
              htmlFor="user-name"
              className="block text-gray-300 text-sm font-bold mb-2 mt-4"
            >
              User Name
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                id="user-name"
                name="user-name"
                type="text"
                autoComplete="user-name"
                value={userName}
                disabled={isPending}
                onChange={(e) => setUserName(e.target.value)}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="user-image"
              className="block text-gray-300 text-sm font-bold mb-2 mt-4"
            >
              Profile Pic URL
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                id="user-image"
                name="user-image"
                type="url"
                autoComplete="user-image"
                value={imgURL}
                disabled={isPending}
                onChange={(e) => setImgURL(e.target.value)}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          </div>
          <div>
            {publicKey ? (
              <button
                type="submit"
                className="relative flex items-center justify-center text-white hover:before:bg-purple-500 h-[50px] md:w-60 w-full overflow-hidden border border-gray-700 bg-transparent px-3 text-black-500 shadow-2xl transition-all rounded-md before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-purple-500 before:transition-all before:duration-500 hover:text-white hover:shadow-purple-lg hover:before:left-0 hover:before:w-full"
                style={{ marginTop: "2rem" }}
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-3 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V2C5.373 2 2 5.373 2 10h2zm16 0a8 8 0 01-8 8v2c4.627 0 8-3.373 8-8h-2zm-8 8a8 8 0 01-8-8H2c0 4.627 3.373 8 8 8v-2zm8-8a8 8 0 018 8h2c0-4.627-3.373-8-8-8v2z"
                      ></path>
                    </svg>
                    <span className="relative z-10 text-sm md:text-base font-semibold">
                      Creating
                    </span>
                  </>
                ) : (
                  <span className="relative z-10 text-sm md:text-base font-semibold">
                    Create Profile
                  </span>
                )}
              </button>
            ) : (
              <p className="text-red-500 mt-4 text-center">
                Please Connect Wallet
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
   );
}
 
export default CreateProfile;
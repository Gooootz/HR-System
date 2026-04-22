const Footer = () => {
  return (
    <footer className="">
      <div className="container mx-auto py-8 px-2 md:px-0">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="mb-4 md:mb-0 mx-auto">
            <img
              src="https://aldersgate.edu.ph/wp-content/uploads/2023/05/344770621_245996101322760_9017855415785289406_n-300x283.png"
              alt=""
              className="h-48 w-48 "
            />
          </div>
          <div className="mb-4 md:mb-0">
            <h2 className="font-semibold text-md mb-4">CONTACT US</h2>
            <div>
              <p className="text-xs text-[#176D3B]">
                Burgos St., Brgy. Quirino, Solano, Nueva Vizcaya 3709
                Philippines
              </p>
              <hr className="m-3" />
              <p className="text-xs text-[#176D3B]">
                Registrar +63 926 207 8642; registrar@aldersgate.edu.ph
              </p>
              <hr className="m-3" />
              <p className="text-xs text-[#176D3B]">
                Treasury +63 078 326 5085, +63 967 003 8642
                treasury@aldersgate.edu.ph
              </p>
              <hr className="m-3" />
              <p className="text-xs text-[#176D3B]">Aldersgate College Inc</p>
            </div>
          </div>
          <div className="mb-4 md:mb-0">
            <h2 className="font-semibold text-md mb-4">WORKING HOURS</h2>
            <div className="font-light text-[14px]md:text-[16px]">
              <p className="text-black ">
                Monday - Saturday <br /> 8:00am - 5:00pm
              </p>
              <p className="text-black ">Sunday - Closed</p>
            </div>
          </div>
          <div className="mb-4 md:mb-0">
            <h2 className="font-semibold text-md mb-4">DOWNLOADS</h2>
            <div className="mb-4">
              <a
                href="././index.html"
                className="text-[13px] text-[#176D3B] border-b border-[#176D3B] hover:bg-[#FFDE01] hover:animate-shake"
              >
                Student Handbook
              </a>
            </div>
            <div>
              <a
                href="././index.html"
                className="text-[13px] text-[#176D3B] border-b border-[#176D3B] hover:bg-[#FFDE01] hover:animate-shake"
              >
                Academic Scholarship Form
              </a>
            </div>
          </div>
          <div className="mb-4 md:mb-0">
            <h2 className="font-semibold text-md">NEWSLETTER</h2>
            <div>
              <p className="text-gray-600 mb-6">
                Stay up to date with our latest news, receive exclusive deals,
                and more.
              </p>
              <input
                type="email"
                placeholder="Enter Your Email Address"
                className="mt-5 mb-3 h-10 border border-gray-300 text-gray-900 text-md w-full p-3 border-b-gray-500 focus:outline-none"
              />
              <span className="">
                <a
                  href="././index.html"
                  className="text-black transition-colors duration-500 hover:text-gray-500"
                >
                  SUBSCRIBE
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="bg-[#FFDE01]">
        <div className="flex items-center justify-center p-5">
          &copy; Aldersgate College Incorporated 2024
        </div>
      </div> */}
    </footer>
  );
};

export default Footer;

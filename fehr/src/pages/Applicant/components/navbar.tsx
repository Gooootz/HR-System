export const ApplicationNav = () => {
  return (
    <nav className="w-full px-2 mx-auto bg-[#135830] sticky top-0 left-0 right-0 z-20 shadow-lg">
      <div className="flex flex-row justify-between items-center py-3 px-2">
        {/* Logo + System Name */}
        <div className="flex flex-row items-center space-x-3 flex-1">
          <img
            className="h-8"
            alt="AC LOGO"
            src="https://aldersgate.edu.ph/wp-content/uploads/2023/05/344770621_245996101322760_9017855415785289406_n-300x283.png"
          />
          <p className="font-normal text-xs text-center md:text-[15px] lg:text-base text-white">
            ALDERSGATE COLLEGE INC
          </p>
        </div>
        <div className="hidden md:flex space-x-6 text-sm uppercase">
          <a href="#" className="text-white hover:text-gray-300 transition">
            About Us
          </a>
          <a href="#" className="text-white hover:text-gray-300 transition">
            Services
          </a>
          <a href="#" className="text-white hover:text-gray-300 transition">
            Contact
          </a>
        </div>
      </div>
    </nav>
  );
};

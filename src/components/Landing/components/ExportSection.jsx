import { FiArrowRight, FiImage, FiFileText, FiCode, FiDownload } from 'react-icons/fi';

export default function ExportSection({ handleCreateDesign }) {
  const exportOptions = [
    {
      title: 'PNG',
      description: 'Lossless raster with transparency when you need a crisp still.',
      icon: <FiImage className="text-3xl mb-3 text-orange-600" />,
    },
    {
      title: 'JPG',
      description: 'Smaller files for photos and flat artwork without transparency.',
      icon: <FiFileText className="text-3xl mb-3 text-orange-600" />,
    },
    {
      title: 'WebP',
      description: 'Modern compression for web use from the same export flow.',
      icon: <FiImage className="text-3xl mb-3 text-orange-600" />,
    },
    {
      title: 'PPost project (.json)',
      description: 'Save everything to reopen and keep editing in the editor later.',
      icon: <FiCode className="text-3xl mb-3 text-orange-600" />,
    },
  ];

  return (
    <section id="export" className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-10 lg:mb-0 lg:pr-16">
            <div className="inline-block px-3 py-1 bg-orange-100 text-orange-900 rounded-full text-sm font-semibold mb-3">
              Export
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Download what you build</h2>
            <p className="text-xl text-gray-600 mb-8">
              The export dialog matches the app: image formats plus a project file—not separate
              marketing formats.
            </p>

            <div className="space-y-6">
              {exportOptions.map((option, index) => (
                <div key={index} className="flex items-start">
                  <div className="mr-4 mt-1">{option.icon}</div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{option.title}</h3>
                    <p className="text-gray-600">{option.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleCreateDesign}
              className="mt-10 bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-8 rounded-lg transition duration-300 shadow-md hover:shadow-lg inline-flex items-center"
            >
              Try exports in the editor
              <FiArrowRight className="ml-2" />
            </button>
          </div>

          <div className="lg:w-1/2 w-full">
            <div className="bg-gray-50 p-6 sm:p-8 rounded-2xl border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-lg">Export panel</h3>
                <div className="bg-orange-100 text-orange-900 text-xs font-medium px-2 py-1 rounded">
                  Brand colors
                </div>
              </div>

              <div
                className="rounded-lg mb-6 border border-orange-100 overflow-hidden aspect-[5/3] max-h-[280px] sm:max-h-[320px] mx-auto flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-amber-50"
                role="img"
                aria-label="Stylized preview of the export area"
              >
                <div className="text-center px-4">
                  <p className="text-orange-800 font-semibold text-sm sm:text-base">PNG · JPG · WebP</p>
                  <p className="text-gray-500 text-xs sm:text-sm mt-1">Plus PPost project JSON</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {['PNG', 'JPG', 'WebP', 'Project'].map((label) => (
                  <div
                    key={label}
                    className="bg-white border border-gray-200 text-gray-800 font-medium py-2.5 rounded-lg flex items-center justify-center text-sm"
                  >
                    <FiDownload className="mr-2 text-orange-600 shrink-0" />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

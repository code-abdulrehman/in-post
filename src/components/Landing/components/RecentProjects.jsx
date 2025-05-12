import { FiArrowRight, FiClock, FiPlusCircle } from 'react-icons/fi';

export default function RecentProjects({ recentProjects, handleOpenProject, handleCreateDesign, formatDate }) {
  if (recentProjects.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-semibold mb-3">
              Your Work
            </div>
            <h2 className="text-3xl font-bold">Recent Projects</h2>
          </div>
          <button
            onClick={handleCreateDesign}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300 flex items-center"
          >
            <FiPlusCircle className="mr-1" /> New Project
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentProjects.map(project => (
            <div
              key={project.id}
              className="border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-300"
              onClick={() => handleOpenProject(project.id)}
            >
              <div
                className="bg-white relative h-[200px] border-b border-gray-200"
                style={{
                  backgroundColor: project.canvasBackground || '#ffffff'
                }}
              >
                <div className={`w-full h-full bg-white/90 text-shadow-md backdrop-blur-sm absolute inset-0 flex flex-col items-center justify-center text-gray-400 text-7xl font-bold opacity-10 text-${project.canvasBackground}`}>
                <h2>

                  {project?.name
                    ? project.name
                      .split(' ')
                      .filter(word => word.length > 0)
                      .map(word => word[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase()
                    : ''}
                </h2>
                    <span className={`text-gary-400 text-xs`}>PPost Designs</span>
                </div>

                {/* Thumbnail preview would go here */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-sm text-gray-400">
                    {project.canvasSize.width} × {project.canvasSize.height}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white">
                <h3 className="font-medium mb-1 truncate">{project.name}</h3>
                <div className="flex items-center text-xs text-gray-500">
                  <FiClock className="mr-1" />
                  <span>Modified {formatDate(project.lastModified)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {recentProjects.length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={handleCreateDesign}
              className="text-indigo-600 font-medium inline-flex items-center hover:underline"
            >
              View All Projects
              <FiArrowRight className="ml-1" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
} 
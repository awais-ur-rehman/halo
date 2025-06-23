export const DepartmentProjectsPage = () => {
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Department Projects
          </h1>
          <div className="inline-flex items-center px-6 py-3 bg-orange-100 border border-orange-200 rounded-lg">
            <div className="w-3 h-3 bg-orange-500 rounded-full mr-3 animate-pulse"></div>
            <span className="text-lg font-medium text-orange-800">
              Feature Under Development
            </span>
          </div>
          <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
            This feature is currently being developed. Check back soon for
            updates.
          </p>
        </div>
      </div>
    </div>
  );
};

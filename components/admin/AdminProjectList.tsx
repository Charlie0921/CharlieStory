type AdminProject = {
  id: string;
  file_no: string;
  title: string;
  status: string | null;
  domain: string | null;
  display_order: number | null;
  is_published: boolean;
};

type AdminProjectListProps = {
  projects: AdminProject[];
};

export default function AdminProjectList({ projects }: AdminProjectListProps) {
  if (!projects.length) {
    return (
      <p className="rounded-lg border border-line bg-mist p-4 text-sm text-ink-soft">
        No projects found.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-line">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-mist">
          <tr>
            <th className="border-b border-line px-3 py-2">Order</th>
            <th className="border-b border-line px-3 py-2">File No</th>
            <th className="border-b border-line px-3 py-2">Title</th>
            <th className="border-b border-line px-3 py-2">Status</th>
            <th className="border-b border-line px-3 py-2">Domain</th>
            <th className="border-b border-line px-3 py-2">Published</th>
          </tr>
        </thead>

        <tbody>
          {projects.map((project) => (
            <tr key={project.id}>
              <td className="border-b border-line px-3 py-2">
                {project.display_order}
              </td>
              <td className="border-b border-line px-3 py-2 font-mono">
                {project.file_no}
              </td>
              <td className="border-b border-line px-3 py-2">
                {project.title}
              </td>
              <td className="border-b border-line px-3 py-2">
                {project.status}
              </td>
              <td className="border-b border-line px-3 py-2">
                {project.domain}
              </td>
              <td className="border-b border-line px-3 py-2">
                {project.is_published ? "Yes" : "No"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
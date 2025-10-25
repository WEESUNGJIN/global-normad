import ExperienceDetail from "@/components/experience-detail/ExperienceDetail";

export default async function ExperienceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const activityId = Number(id);
  return <ExperienceDetail activityId={activityId} />;
}

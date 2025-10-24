import ExperienceDetail from "@/components/experience-detail/ExperienceDetail";

interface ExperienceDetailPageProps {
  params: { id: string };
}

export default async function ExperienceDetailPage({
  params,
}: ExperienceDetailPageProps) {
  const { id } = await params;
  return <ExperienceDetail activityId={Number(id)} />;
}

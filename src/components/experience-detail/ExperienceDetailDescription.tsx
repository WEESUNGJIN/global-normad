interface ExperienceDetailDescriptionProps {
  description: string;
}

export default function ExperienceDetailDescription({
  description,
}: ExperienceDetailDescriptionProps) {
  return (
    <section className="py-5 md:py-8 border-b border-gray-100">
      <h2 className="typo-16-b md:text-lg text-gray-950 mb-2 md:mb-3">
        체험 설명
      </h2>
      <p className="typo-14-m !leading-[1.7] md:text-base text-gray-950">
        {description || "설명이 등록되지 않았습니다."}
      </p>
    </section>
  );
}

interface ExperienceDetailMapProps {
  address: string;
}

export default function ExperienceDetailMap({
  address,
}: ExperienceDetailMapProps) {
  return (
    <section className="py-5 md:py-8 border-b border-gray-100">
      <h2 className="typo-16-b md:text-lg text-gray-950 mb-2">오시는 길</h2>
      <p className="typo-14-sb md:text-base text-gray-700 mb-2 md:mb-3">
        {address}
      </p>

      <div className="w-full h-[23vh] md:h-[40vh] rounded-2xl overflow-hidden bg-gray-100">
        {/* 카카오 지도나 네이버 지도 iframe 삽입 예정 */}
      </div>
    </section>
  );
}

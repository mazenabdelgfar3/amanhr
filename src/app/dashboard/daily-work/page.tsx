import DailyWorkSheet from "@/features/daily-work/components/DailyWorkSheet";

export const dynamic = "force-dynamic";

export default function DailyWorkPage() {
  return (
    <div className="space-y-6">
      <DailyWorkSheet />
    </div>
  );
}

import FrequentFlyerTable from "@/components/frequent-flyer-table";
import Provider from "@/components/Provider";

export default function FrequentFlyersPage() {
  return (
    <div>
      <div className="max-w-7xl mx-auto">
        <Provider>
          <FrequentFlyerTable />
        </Provider>
      </div>
    </div>
  );
}

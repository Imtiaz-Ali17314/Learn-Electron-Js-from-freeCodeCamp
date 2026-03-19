import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { useStatistics } from "./useStatistics";
import { Chart } from "./Chart";
function App() {
  const staticData = useStaticData();
  const statistics = useStatistics(10);
  const [activeView, setActiveView] = useState<View>("CPU");

  const cpuUsages = useMemo(
    () => statistics.map((stat) => stat.cpuUsage),
    [statistics],
  );

  const ramUsages = useMemo(
    () => statistics.map((stat) => stat.ramUsage),
    [statistics],
  );

  const storageUsages = useMemo(
    () => statistics.map((stat) => stat.storageUsage),
    [statistics],
  );

  const activeUsages = useMemo(() => {
    switch (activeView) {
      case "CPU":
        return cpuUsages;
      case "RAM":
        return ramUsages;
      case "STORAGE":
        return storageUsages;
    }
  }, [activeView, cpuUsages, ramUsages, storageUsages]);

  useEffect(() => {
    return window.electron.subscribeChangeView((view) => setActiveView(view));
  }, []);

  return (
    <>
      <div>
        <Header />
        <div className="main">
          <div>
            <SelectOption
              onClick={() => setActiveView("CPU")}
              title="CPU"
              view="CPU"
              subtitle={staticData?.cpuModel ?? ""}
              data={cpuUsages}
            />
            <SelectOption
              onClick={() => setActiveView("RAM")}
              title="RAM"
              view="RAM"
              subtitle={(staticData?.totalMemoryGB.toString() ?? "") + " GB"}
              data={ramUsages}
            />
            <SelectOption
              onClick={() => setActiveView("STORAGE")}
              title="STORAGE"
              view="STORAGE"
              subtitle={(staticData?.totalStorage.toString() ?? "") + " GB"}
              data={storageUsages}
            />
          </div>
          <div className="mainGrid">
            <Chart
              selectedView={activeView}
              data={activeUsages}
              maxDataPoints={10}
            />
          </div>
        </div>
      </div>
    </>
  );
}

function SelectOption(props: {
  title: string;
  view: View;
  subtitle: string;
  data: number[];
  onClick: () => void;
}) {
  return (
    <button className="selectOptions" onClick={props.onClick}>
      <div className="selectOptionTitle">
        <div>{props.title}</div>
        <div>{props.subtitle}</div>
      </div>
      <div className="selectOptionCarts">
        {" "}
        <Chart selectedView={props.view} data={props.data} maxDataPoints={10} />
      </div>
    </button>
  );
}

function Header() {
  return (
    <header>
      <button
        id="minimize"
        onClick={() => window.electron.sendFrameAction("MINIMIZE")}
      >
        <span className="material-symbols-outlined">minimize</span>
      </button>

      <button
        id="maximize"
        onClick={() => window.electron.sendFrameAction("MAXIMIZE")}
      >
        <span className="material-symbols-outlined">maximize</span>
      </button>

      <button
        id="close"
        onClick={() => window.electron.sendFrameAction("CLOSE")}
      >
        <span className="material-symbols-outlined">close</span>
      </button>
    </header>
  );
}

function useStaticData() {
  const [staticData, setStaticData] = useState<StaticData | null>(null);

  useEffect(() => {
    (async () => {
      setStaticData(await window.electron.getStaticData());
    })();
  }, []);

  return staticData;
}

export default App;

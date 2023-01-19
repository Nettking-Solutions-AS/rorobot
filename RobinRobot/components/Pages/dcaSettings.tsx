import React, { useState } from "react";

interface Props {
  onSave: (settings: object) => void;
}

const SettingsPage: React.FC<Props> = ({ onSave }) => {
  const [settings, setSettings] = useState({
    asset: "",
    base: "",
    spread: 0,
    allocation: 0,
    tickInterval: 0
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings({ ...settings, [name]: value });
  };

  const handleSave = () => {
    onSave(settings);
  };

  return (
    <div>
      <form>
        <label htmlFor="asset">Asset:</label>
        <input
          type="text"
          id="asset"
          name="asset"
          value={settings.asset}
          onChange={handleInputChange}
        />

        <label htmlFor="base">Base:</label>
        <input
          type="text"
          id="base"
          name="base"
          value={settings.base}
          onChange={handleInputChange}
        />

        <label htmlFor="spread">Spread:</label>
        <input
          type="number"
          id="spread"
          name="spread"
          value={settings.spread}
          onChange={handleInputChange}
        />

                <label htmlFor="allocation">Allocation:</label>
        <input
          type="number"
          id="allocation"
          name="allocation"
          value={settings.allocation}
          onChange={handleInputChange}
        />
        <label htmlFor="tickInterval">Tick Interval(ms):</label>
        <input
          type="number"
          id="tickInterval"
          name="tickInterval"
          value={settings.tickInterval}
          onChange={handleInputChange}
        />
      </form>
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default SettingsPage;


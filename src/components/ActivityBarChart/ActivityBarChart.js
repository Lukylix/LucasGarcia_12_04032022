import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import dataProvider from "../../utils/dataProvider";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

import "./ActivityBarChart.scss";
import UserActivity from "../../utils/models/UserActivity";

const formaterTooltip = (value, name) => {
  const unitDic = {
    kilogram: "kg",
    calories: "Kcal",
  };
  return [`${value}${unitDic[name]}`];
};

function ActivityBarChart() {
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const { data, error } = await dataProvider.getUserActivity(id);
      setError(error);
      const userActivity = new UserActivity(data);
      setChartData(
        userActivity.sessions.map((session) => ({ kilogram: session.kilogram, calories: session.calories }))
      );
    })();
  }, [id]);

  useEffect(() => {
    if (error) navigate("/404");
  }, [error, navigate]);

  return (
    <div className="activityBarChart">
      <div className="activityBarChart__header">
        <h3>Activité quotidienne</h3>
        <p>
          <span className="dot dot--black"></span>Poids (kg)
          <span className="dot dot--red"></span>Calories brûlées (kCal)
        </p>
      </div>
      <ResponsiveContainer aspect={4}>
        <BarChart
          width={500}
          height={300}
          data={chartData}
          margin={{
            top: 5,
            right: 25,
            bottom: 5,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis domain={[1, chartData.length]} axisLine={false} tickLine={false} tickMargin={15} stroke="#9B9EAC" />
          <YAxis orientation="right" tickCount={3} axisLine={false} tickLine={false} tickMargin={45} stroke="#9B9EAC" />
          <Tooltip
            formatter={formaterTooltip}
            labelStyle={{ display: "none" }}
            contentStyle={{ backgroundColor: "#E60000" }}
            itemStyle={{ color: "white", fontSize: "12px", lineHeight: "24px" }}
          />
          <Bar dataKey="kilogram" fill="#282D30" barSize={7} radius={[3.5, 3.5, 0, 0]} />
          <Bar dataKey="calories" fill="#E60000" barSize={7} radius={[3.5, 3.5, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ActivityBarChart;

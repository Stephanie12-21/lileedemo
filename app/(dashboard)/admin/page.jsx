"use client";
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Users, Building2, FileText, Handshake } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import AnimatedSymbol from "@/components/MainComponents/Sections/Loading/AnimatedSymbol";

const chartConfig = {
  annonces: { label: "Annonces", color: "#15213d" },
  utilisateurs: { label: "Utilisateurs", color: "#34d399" },
  entreprises: { label: "Entreprises", color: "#f19d13" },
  transactions: { label: "Transactions", color: "#d9534f" },
};

const StatsCard = ({ title, value = 0, icon: Icon, gradient }) => (
  <div
    className={`relative overflow-hidden rounded-xl p-6 ${gradient} transition-transform hover:scale-105`}
  >
    <div className="absolute right-0 top-0 opacity-10">
      <Icon size={100} className="transform translate-x-8 -translate-y-8" />
    </div>
    <div className="relative">
      <div className="flex items-center gap-3">
        <Icon size={24} className="text-white" />
        <h3 className="font-semibold text-white">{title}</h3>
      </div>
      <p className="mt-4 text-3xl font-bold text-white">
        {parseInt(value, 10).toLocaleString()}{" "}
      </p>
    </div>
  </div>
);

const StatsDashboard = ({ stats }) => (
  <div className="grid grid-cols-4 gap-x-4 p-6">
    <StatsCard
      title="Annonces"
      value={stats.annonces}
      icon={FileText}
      gradient="bg-gradient-to-br from-[#15213d] to-[#15213d]"
    />
    <StatsCard
      title="Utilisateurs"
      value={stats.utilisateurs}
      icon={Users}
      gradient="bg-gradient-to-br from-[#34d399] to-[#34d399]"
    />
    <StatsCard
      title="Entreprises"
      value={stats.entreprises}
      icon={Building2}
      gradient="bg-gradient-to-br from-[#f19d13] to-[#f19d13]"
    />
    <StatsCard
      title="Transactions"
      value={stats.transactions}
      icon={Handshake}
      gradient="bg-gradient-to-br from-[#d9534f] to-[#d9534f]"
    />
  </div>
);

const AdminPreview = () => {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/stats/");
      const data = await response.json();

      setStats({
        annonces: data.totalAnnonces,
        utilisateurs: data.totalUsers,
        entreprises: data.totalEntreprises,
        transactions: data.totalPartenaires,
      });

      const groupedData = data.dailyStats.reduce((acc, entry) => {
        const date = new Date(entry.date);
        const formattedDate = format(date, "dd MMM yyyy", { locale: fr });
        if (!acc[formattedDate]) {
          acc[formattedDate] = {
            name: formattedDate,
            annonces: 0,
            utilisateurs: 0,
            entreprises: 0,
            transactions: 0,
            rawDate: date,
          };
        }
        acc[formattedDate].annonces += parseInt(entry.annonces, 10);
        acc[formattedDate].utilisateurs += parseInt(entry.utilisateurs, 10);
        acc[formattedDate].entreprises += parseInt(entry.entreprises, 10);
        acc[formattedDate].transactions += parseInt(entry.transactions, 10);
        return acc;
      }, {});

      const sortedData = Object.values(groupedData).sort(
        (a, b) => a.rawDate - b.rawDate
      );

      const finalChartData = sortedData.map(({ rawDate, ...rest }) => rest);

      setChartData(finalChartData);
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen ">
        <AnimatedSymbol />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 text-base">
      <div className="container mx-auto px-7 pt-8 pb-0">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold text-gray-800">
            Tableau de bord de l&apos;administrateur
          </h1>
        </div>
        <StatsDashboard stats={stats} />
        <div className="py-8 px-5">
          <Card className="mt-4 p-6">
            <CardHeader>
              <CardTitle className="text-lg">
                Graphique de la représentation des données
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <AreaChart data={chartData} className="w-full h-screen p-0">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 16 }} />
                  <YAxis tick={{ fontSize: 16 }} />
                  <Tooltip contentStyle={{ fontSize: "16px" }} />
                  <Legend wrapperStyle={{ fontSize: "16px" }} />
                  <Area
                    type="monotone"
                    dataKey="annonces"
                    stackId="1"
                    stroke={chartConfig.annonces.color}
                    fill={chartConfig.annonces.color}
                  />
                  <Area
                    type="monotone"
                    dataKey="utilisateurs"
                    stackId="1"
                    stroke={chartConfig.utilisateurs.color}
                    fill={chartConfig.utilisateurs.color}
                  />
                  <Area
                    type="monotone"
                    dataKey="entreprises"
                    stackId="1"
                    stroke={chartConfig.entreprises.color}
                    fill={chartConfig.entreprises.color}
                  />
                  <Area
                    type="monotone"
                    dataKey="transactions"
                    stackId="1"
                    stroke={chartConfig.transactions.color}
                    fill={chartConfig.transactions.color}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminPreview;

import { Navigate, Route, Routes } from "react-router-dom";

import { GamePage } from "@/pages/game-page";
import { HomePage } from "@/pages/home-page";
import { ResultPage } from "@/pages/result-page";

import { routes } from "@/shared/config";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<HomePage />} path={routes.home} />
      <Route element={<GamePage />} path={routes.game} />
      <Route element={<ResultPage />} path={routes.result} />
      <Route element={<Navigate replace to={routes.home} />} path="*" />
    </Routes>
  );
}

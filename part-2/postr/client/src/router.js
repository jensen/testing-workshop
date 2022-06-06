import { BrowserRouter, Routes, Route } from "react-router-dom";

import Root from "./pages/root";
import Index from "./pages/index";
import New from "./pages/new";
import Show from "./pages/show";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Root />}>
          <Route index element={<Index />} />
          <Route path="new" element={<New />} />
          <Route path=":id/*" element={<Show />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

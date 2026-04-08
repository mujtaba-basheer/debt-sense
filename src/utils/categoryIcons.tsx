import RestaurantRoundedIcon from "@mui/icons-material/RestaurantRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import SportsEsportsRoundedIcon from "@mui/icons-material/SportsEsportsRounded";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";

export const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  dining: <RestaurantRoundedIcon sx={{ fontSize: 18 }} />,
  transport: <DirectionsCarRoundedIcon sx={{ fontSize: 18 }} />,
  leisure: <SportsEsportsRoundedIcon sx={{ fontSize: 18 }} />,
  groceries: <ShoppingBagRoundedIcon sx={{ fontSize: 18 }} />,
  shopping: <ShoppingBagRoundedIcon sx={{ fontSize: 18 }} />,
};

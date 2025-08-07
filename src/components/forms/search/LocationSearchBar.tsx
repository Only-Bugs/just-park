import { useEffect, useState } from "react";
import {
  Autocomplete,
  CircularProgress,
  Box,
  InputBase,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import searchBarStyles from "./styles";

import { fetchLocationSuggestions } from "../../../services/location";
import type { Suggestion } from "../../../types/search";

type Props = {
  onSelectLocation: (location: { lat: number; lng: number }) => void;
};

export default function LocationSearchBar({ onSelectLocation }: Props) {
  const [input, setInput] = useState("");
  const [options, setOptions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [debouncedInput, setDebouncedInput] = useState(input);
  const [searchCache, setSearchCache] = useState<Record<string, Suggestion[]>>(
    {}
  );

  // Debounce
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedInput(input), 500);
    return () => clearTimeout(handler);
  }, [input]);

  // Fetch suggestions
  useEffect(() => {
    if (debouncedInput.length < 3) return;

    if (searchCache[debouncedInput]) {
      setOptions(searchCache[debouncedInput]);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const results = await fetchLocationSuggestions(debouncedInput);
        setOptions(results);
        setSearchCache((prev) => ({ ...prev, [debouncedInput]: results }));
      } catch (err) {
        console.error("Suggestion fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [debouncedInput]);

  return (
    <Autocomplete
      freeSolo
      options={options}
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.display_name
      }
      onInputChange={(_, value) => setInput(value)}
      onChange={(_, value) => {
        if (typeof value === "object" && value?.lat && value?.lon) {
          onSelectLocation({
            lat: parseFloat(value.lat),
            lng: parseFloat(value.lon),
          });
        }
      }}
      loading={loading}
      renderInput={(params) => (
        <Box sx={searchBarStyles.container}>
          <SearchIcon sx={searchBarStyles.icon} />
          <InputBase
            {...params.InputProps}
            inputProps={{
              ...params.inputProps,
              placeholder: "Search...",
            }}
            sx={searchBarStyles.input}
          />
        </Box>
      )}
    />
  );
}

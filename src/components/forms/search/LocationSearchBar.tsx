import { useEffect, useMemo, useState } from "react";
import {
  Autocomplete,
  Box,
  Divider,
  IconButton,
  Typography,
  InputBase,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import searchBarStyles from "./styles";

import { fetchLocationSuggestions } from "../../../services/location";
import type { Suggestion, StoredPlace } from "../../../types/search";
import { useRecentSearches } from "../../../hooks/useRecentSearches";

type Props = {
  onSelectLocation: (location: { lat: number; lng: number }) => void;
};

type Option =
  | { kind: "recent"; data: StoredPlace }
  | { kind: "live"; data: Suggestion };

export default function LocationSearchBar({ onSelectLocation }: Props) {
  const [input, setInput] = useState("");
  const [live, setLive] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [debounced, setDebounced] = useState(input);
  const { list: recent, add, clear } = useRecentSearches();

  useEffect(() => {
    const t = setTimeout(() => setDebounced(input), 500);
    return () => clearTimeout(t);
  }, [input]);

  useEffect(() => {
    let active = true;
    (async () => {
      if (debounced.trim().length < 3) {
        setLive([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetchLocationSuggestions(debounced);
        if (active) setLive(res);
      } catch (e) {
        console.error("Suggestion fetch error:", e);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [debounced]);

  const options: Option[] = useMemo(() => {
    const showRecent = input.trim().length < 3;
    const recentOpts: Option[] = showRecent
      ? recent.map((r) => ({ kind: "recent", data: r }))
      : [];
    const liveOpts: Option[] = live.map((s) => ({ kind: "live", data: s }));
    return [...recentOpts, ...liveOpts];
  }, [input, live, recent]);

  return (
    <Autocomplete<Option, false, false, false>
      freeSolo={false}
      clearIcon={null}
      popupIcon={null}
      options={options}
      loading={loading}
      filterOptions={(opts) => opts}
      openOnFocus
      getOptionLabel={(opt) =>
        opt.kind === "recent" ? opt.data.label : opt.data.display_name
      }
      groupBy={(opt) => (opt.kind === "recent" ? "Recent" : "Live results")}
      isOptionEqualToValue={(a, b) => {
        if (a.kind !== b.kind) return false;
        if (a.kind === "recent" && b.kind === "recent") {
          return (
            a.data.label === b.data.label &&
            a.data.lat === b.data.lat &&
            a.data.lng === b.data.lng
          );
        }
        return a.data.lat === b.data.lat && a.data.lon === b.data.lon;
      }}
      onInputChange={(_, value) => setInput(value)}
      onChange={(_, value: Option | null) => {
        if (!value) return;
        if (value.kind === "recent") {
          setInput(value.data.label);
          onSelectLocation({ lat: value.data.lat, lng: value.data.lng });
          return;
        }
        const lat = parseFloat(value.data.lat);
        const lng = parseFloat(value.data.lon);
        const label = value.data.display_name;
        add({ label, lat, lng });
        setInput(label);
        onSelectLocation({ lat, lng });
      }}
      renderInput={(params) => (
        <Box
          sx={searchBarStyles.container}
          ref={params.InputProps.ref as React.Ref<HTMLDivElement>}
        >
          <SearchIcon sx={searchBarStyles.icon} />
          <InputBase
            {...params.InputProps}
            inputRef={params.inputProps.ref as React.Ref<HTMLInputElement>}
            inputProps={{
              ...params.inputProps,
              placeholder: "Search Melbourne…",
            }}
            sx={searchBarStyles.input}
          />
          {params.InputProps.endAdornment}
          {recent.length > 0 && input.trim().length < 3 && (
            <>
              <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
              <IconButton
                aria-label="Clear recent"
                size="small"
                onMouseDown={(e) => e.preventDefault()}
                onClick={clear}
                title="Clear recent"
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </>
          )}
        </Box>
      )}
      renderOption={(props, option) => {
        const key =
          option.kind === "recent"
            ? `${option.data.lat},${option.data.lng},${option.data.label}`
            : `${option.data.lat},${option.data.lon}`;
        return (
          <li {...props} key={key}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {option.kind === "recent"
                  ? option.data.label
                  : option.data.display_name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {option.kind === "recent" ? "Recent" : "Live"}
              </Typography>
            </Box>
          </li>
        );
      }}
    />
  );
}

import React, { useState } from "react";
import styled from "styled-components";
import { FaHome, FaBolt, FaSearch } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { zoomToLocation } from "./map";

const SidebarContainer = styled.div`
  width: 80px;
  height: 100vh;
  background-color: #111;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  color: #fff;
  position: relative;
`;

const SidebarExtended = styled.div`
  width: 300px;
  height: 100vh;
  background-color: #1a1a1a;
  display: flex;
  flex-direction: column;
  padding-top: 20px;
  color: #fff;
  position: absolute;
  top: 0;
  left: 80px;
  transition: transform 0.3s ease-in-out;
`;

const MenuItem = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 10px 0px;
  cursor: pointer;
  &:hover {
    background-color: #333;
  }
`;

const IconWrapper = styled.div`
  margin-right: 20px;
  padding: 20px;
  color: #fff;
`;

const Label = styled.span`
  font-size: 18px;
  padding-left: 10px;
`;

type SelectedItemType = "home" | "apps" | "search";

const fetchLocations = async () => {
  const response = await fetch(
    "https://angelswing-frontend-test-serverless-api.vercel.app/api/locations"
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const Sidebar: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<SelectedItemType | null>(
    "home"
  );
  const { data, error, isLoading } = useQuery({
    queryKey: ["locations"],
    queryFn: fetchLocations,
  });

  const handleItemClick = (item: SelectedItemType) => {
    setSelectedItem(selectedItem === item ? null : item);
  };

  const handleLocationClick = (location: [number, number]) => {
    zoomToLocation(location[1], location[0]);
  };

  return (
    <SidebarContainer>
      <MenuItem onClick={() => handleItemClick("home")}>
        <IconWrapper>
          <FaHome size={30} />
        </IconWrapper>
      </MenuItem>
      <MenuItem onClick={() => handleItemClick("apps")}>
        <IconWrapper>
          <FaBolt size={30} />
        </IconWrapper>
      </MenuItem>
      <MenuItem onClick={() => handleItemClick("search")}>
        <IconWrapper>
          <FaSearch size={30} />
        </IconWrapper>
      </MenuItem>
      <SidebarExtended
        style={{
          transform: selectedItem ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        {selectedItem === "home" && (
          <>
            {isLoading && <div>Loading...</div>}
            {error && <div>Error loading locations</div>}
            {data &&
              data.locations.map(
                (location: [number, number], index: number) => (
                  <MenuItem
                    key={index}
                    onClick={() => handleLocationClick(location)}
                  >
                    <Label>{`Location ${index + 1}`}</Label>
                  </MenuItem>
                )
              )}
          </>
        )}
        {selectedItem === "apps" && (
          <>
            <MenuItem>
              <IconWrapper>
                <FaBolt />
              </IconWrapper>
              <Label>App 1</Label>
            </MenuItem>
            <MenuItem>
              <IconWrapper>
                <FaBolt />
              </IconWrapper>
              <Label>App 2</Label>
            </MenuItem>
          </>
        )}
      </SidebarExtended>
    </SidebarContainer>
  );
};

export default Sidebar;

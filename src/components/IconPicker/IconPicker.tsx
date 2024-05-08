import { useState } from "react";
import { IconName } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./IconPicker.scss";
import { useIconPicker } from "./useIconPicker";
import { FixedSizeGrid as Grid } from "react-window";
import { IconLookup } from "@fortawesome/free-solid-svg-icons";

export type FontAwesomeIconPickerProps = {
  value?: string;
  onChange?: (value: string) => void;
};

const IconPicker = ({ value, onChange }: FontAwesomeIconPickerProps) => {
  const [searchText, setSearchText] = useState("");
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const iconPack = useIconPicker();

  if (!iconPack) {
    return <div>Loading...</div>;
  }

  const uniqueIconPack: IconLookup[] = iconPack.reduce(
    (unique: IconLookup[], icon: IconLookup) => {
      if (!unique.some((obj: IconLookup) => obj.iconName === icon.iconName)) {
        unique.push(icon);
      }
      return unique;
    },
    []
  );

  const iconsFiltered = uniqueIconPack.filter((icon) => {
    return icon.iconName.includes(searchText.toLowerCase());
  });

  const numColumns = 11;
  const numRows = Math.ceil(iconsFiltered.length / numColumns);

  const Cell = ({
    columnIndex,
    rowIndex,
    style,
  }: {
    columnIndex: any;
    rowIndex: any;
    style: any;
  }) => {
    const icon = iconsFiltered[rowIndex * numColumns + columnIndex];
    return (
      <div style={style} className="iconPicker__iconWrapper">
        {icon && (
          <button
            className={`iconPicker__iconItem ${
              icon.iconName === value ? "selected" : ""
            }`}
            title={icon.iconName}
            onClick={() => onChange?.(icon.iconName)}
          >
            <FontAwesomeIcon icon={icon} />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="pl-1">
      <div className="flex flex-row gap-2">
        <button className="text-black">
          {value ? (
            <div className="flex flex-row gap-2 justify-center items-center">
              <FontAwesomeIcon
                onClick={(e: any) => setAnchorEl(e.currentTarget)}
                icon={["fas", value as IconName]}
                color="#000000"
              />
              <button
                onClick={() => {
                  setAnchorEl(null);
                  onChange?.("");
                }}
                className="text-black bg-red-100 rounded-md p-1"
              >
                Clear
              </button>
            </div>
          ) : (
            <div onClick={(e: any) => setAnchorEl(e.currentTarget)}>
              Edit Icon
            </div>
          )}
        </button>
      </div>
      {anchorEl === null ? null : (
        <div className="iconPicker__popoverContainer">
          <div className="iconPicker__popoverHeader">
            <input
              className="rounded-md pl-2"
              type="text"
              placeholder="Search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <Grid
            className="iconPicker__iconsContainer"
            width={400} // Set the width of the viewport
            height={200} // Set the height of the viewport
            columnCount={numColumns}
            rowCount={numRows}
            columnWidth={35} // Set the width of each cell
            rowHeight={35} // Set the height of each cell
          >
            {Cell}
          </Grid>
        </div>
      )}
    </div>
  );
};
export default IconPicker;

import React, { useRef } from "react";
import DataGrid, { Column, Editing, Popup, Form } from "devextreme-react/data-grid";
import { Item } from "devextreme-react/form";
import { TagBox } from "devextreme-react/tag-box";
import CustomStore from "devextreme/data/custom_store";
import groups from "../src/data/groups.json";
import drugs from "../src/data/drugs.json";

import "./App.css";

const initialData = [
  { id: 1, groupName: "Đọc giống - Nhìn giống", drugIds: [1, 2, 3] },
  { id: 2, groupName: "Đọc khác - nhìn khác", drugIds: [2, 4] },
];

// Tạo CustomStore để quản lý CRUD
const customStore = new CustomStore({
  key: "id",
  load: async () => {
    return initialData;
  },
  insert: async (values) => {
    const newId = initialData.length ? Math.max(...initialData.map((d) => d.id)) + 1 : 1;
    const newItem = { ...values, id: newId };
    initialData.push(newItem);
    return newItem;
  },
  update: async (key, values) => {
    const index = initialData.findIndex((item) => item.id === key);
    if (index !== -1) {
      initialData[index] = { ...initialData[index], ...values };
    }
  },
  remove: async (key) => {
    const index = initialData.findIndex((item) => item.id === key);
    if (index !== -1) {
      initialData.splice(index, 1);
    }
  },
});

const App = () => {
  const dataGridRef = useRef<any>(null);

  const groupOptions = groups;
  const drugsData = drugs;

  const handleRowDblClick = (e: any) => {
    dataGridRef.current?.instance?.editRow(e.rowIndex);
  };

  const renderTagBox = (cellData: any) => {
    const ids: number[] = cellData.value || [];
    const selectedDrugs = drugsData.filter((drug) => ids.includes(drug.id));
    return (
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        {selectedDrugs.map((drug) => (
          <span
            key={drug.id}
            style={{
              backgroundColor: "#d1d1d1",
              borderRadius: "8px",
              padding: "4px 10px",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            {drug.name}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div style={{ padding: "30px" }}>
      <DataGrid
        ref={dataGridRef}
        dataSource={customStore}
        keyExpr="id"
        showBorders={true}
        onRowDblClick={handleRowDblClick}
      >
        <Editing
          mode="popup"
          allowAdding={true}
          // allowUpdating={true}
          // allowDeleting={true}
          startEditAction="dblClick"
          useIcons={true}
        >
          <Popup title="Thông tin" showTitle={true} width={500} height={300} />
          <Form colCount={1} labelLocation="top" >
          {/* <Form colCount={1} labelLocation="top" cssClass="compact-form"> */}
            <Item
              dataField="groupName"
              editorType="dxSelectBox"
              editorOptions={{
                items: groupOptions,
                valueExpr: "name",
                displayExpr: "name",
                placeholder: "Chọn nhóm...",
                searchEnabled: true,
              }}
            />
            <Item
              dataField="drugIds"
              editorType="dxTagBox"
              editorOptions={{
                items: drugsData,
                valueExpr: "id",
                displayExpr: "name",
                searchEnabled: true,
                showSelectionControls: true,
                applyValueMode: "useButtons",
                multiline: true,
                showDropDownButton: true,
                dropDownOptions: { height: 300 },
                placeholder: "Tìm và chọn thuốc...",
              }}
            />
          </Form>
        </Editing>

        <Column dataField="groupName" caption="Tên nhóm" />

        <Column
          dataField="drugIds"
          caption="Thuốc LASA"
          editCellRender={({ data, setValue }) => (
            <TagBox
              items={drugsData}
              value={data.drugIds || []}
              valueExpr="id"
              displayExpr="name"
              onValueChanged={(e) => setValue(e.value)}
              searchEnabled
              showSelectionControls
              // applyValueMode="useButtons"
              multiline
              showDropDownButton
              placeholder="Tìm và chọn thuốc..."
              dropDownOptions={{ height: 300 }}
              onSelectionChanged={(e) => {
                if (e.addedItems.length > 0) {
                  (e.component.field() as HTMLInputElement).value = ""; // clear the textr
                  e.component.close(); // close the drop down list
                }
                //còn hiển thị giá trị search trên thanh input
                //custom xóa thì phải thao tác close dropdown
                //https://supportcenter.devexpress.com/ticket/details/t994950/tagbox-how-to-clear-the-search-text-after-selecting-an-item
              }}
            />
          )}
          cellRender={renderTagBox}
        />
      </DataGrid>
    </div>
  );
};

export default App;

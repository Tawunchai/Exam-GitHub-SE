import { LayoutDashboard, CopyPlus,Tent  } from "lucide-react";
import { Button, Modal, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { createTheme, ThemeProvider } from "@mui/material";
import MUIDataTable from "mui-datatables";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ListHabitat, DeleteHabitatByID } from "../../../services/https";
import { HabitatInterface } from "../../../interface/IHabitat";
import "./stylehabitat.css";

// Define selectable rows options
type SelectableRows = "none" | "single" | "multiple";

const habitat = () => {
  const [habitats, setHabitats] = useState<HabitatInterface[]>([]);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState<string>("");
  const [deleteId, setDeleteId] = useState<number | undefined>();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [habitatCount, setHabitat] = useState<number>(0);

  // Define columns for MUIDataTable
  const columns = [
    {
      name: "ID",
      label: "A.No",
      options: { filter: false },
    },
    {
      name: "Picture",
      label: "Picture",
      options: {
        customBodyRender: (value: string) => (
          <img
            src={`http://localhost:8000/${value || "default-image.jpg"}`}
            style={{ width: "100px", borderRadius: "80px" }}
            alt="profile"
          />
        ),
        filter: false,
      },
    },
    {
      name: "Name",
      label: "Name",
      options: { filter: false },
    },
    {
      name: "Size",
      label: "Size",
      options: { filter: false },
    },
    {
      name: "Zone",
      label: "Zone",
    },
    {
      name: "Manage",
      label: "Manage",
      options: {
        customBodyRender: (value: unknown, tableMeta: { rowIndex: number }) => {
          console.log(value);
          const record = habitats[tableMeta.rowIndex];
          return (
            <>
              <Button
                onClick={() => navigate(`/zookeeper/habitat/edit/${record.ID}`)}
                shape="circle"
                icon={<EditOutlined />}
                size={"large"}
              />
              <Button
                onClick={() => showModal(record)}
                style={{ marginLeft: 10 }}
                shape="circle"
                icon={<DeleteOutlined />}
                size={"large"}
                danger
              />
            </>
          );
        },
      },
    },
  ];

  const showModal = (val: HabitatInterface) => {
    setModalText(`Are you sure you want to delete "${val.Name}"?`);
    setDeleteId(val.ID);
    setOpen(true);
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    console.log("Attempting to delete animal with ID:", deleteId);

    try {
      const res = await DeleteHabitatByID(deleteId);
      if (res) {
        setOpen(false);
        messageApi.open({
          type: "success",
          content: "Successfully deleted!",
        });
        getHabitats();
      } else {
        throw new Error("Delete failed");
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "An error occurred!",
      });
    }
    setConfirmLoading(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const getHabitats = async () => {
    console.log("Fetching animal data...");
    try {
      const res = await ListHabitat();
      console.log("ListHabitat response:", res);

      if (res && res.length > 0) {
        const processedData = res.map((habitat: HabitatInterface) => ({
          ID: habitat.ID,
          Name: habitat.Name,
          Size: habitat.Size,
          Capacity: habitat.Capacity,
          Picture: habitat.Picture,
          Zone: habitat.ZoneID
        }));
        setHabitats(processedData);
        setHabitat(res.length); 
        console.log("Processed Animals Data:", processedData);
      } else {
        console.error("No data returned from ListAnimal");
      }
    } catch (error) {
      console.error("Error fetching animal data:", error);
    }
  };

  useEffect(() => {
    getHabitats();
  }, []);

  const options = {
    selectableRows: "none" as SelectableRows, // Ensuring correct type for selectableRows
    filterType: "checkbox" as const,
    rowsPerPage: 2, // Number of rows per page
    rowsPerPageOptions: [5, 10, 20, 30], // Options for number of rows per page
  };

  const getMuitheme = () =>
    createTheme({
      typography: {
        fontFamily: "cursive",
      },
      palette: {
        mode: "light",
      },
      components: {
        MuiTableCell: {
          styleOverrides: {
            head: {
              padding: "10px 4px",
            },
            body: {
              padding: "7px 15px",
              color: "gray",
            },
          },
        },
      },
    });

  return (
    <div className="bg-slate-700 py-10 min-h-screen grid place-items-center">
      {contextHolder}
      <div className="w-10/12 max-w-4xl content-container">
        <div style={{ display: "flex" }}>
          <h1 className="header-habitat-box">
            <LayoutDashboard size={24} style={{ marginRight: "10px" }} />
            Habitat
          </h1>
          <h1 className="header-population-habitats-box">
            <Tent   size={28} style={{ marginRight: "10px" }} />
            Total Habitat : {habitatCount}
          </h1>
          <Link to="/zookeeper/create-habitat">
            <h1 className="header-habitatADD-box">
              <CopyPlus size={24} style={{ marginRight: "10px" }} />
              Create Habitat
            </h1>
          </Link>
        </div>
        <ThemeProvider theme={getMuitheme}>
          <MUIDataTable
            title={"Habitats List"}
            data={habitats}
            columns={columns}
            options={options}
          />
        </ThemeProvider>
      </div>
      <Modal
        title="Delete Confirmation"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p>{modalText}</p>
      </Modal>
    </div>
  );
};

export default habitat;

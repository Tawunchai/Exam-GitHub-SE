import React from "react";
import { Form, Input, Button, message, Upload } from "antd";
import ReactDOM from "react-dom";
import { ReviewInterface } from "../../../interface/IReview";
import { CreateReview } from "../../../services/https";
import { useNavigate } from "react-router-dom";
import StarRating from "../../../feature/star";
import "../review.css";
import { PlusOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import type { UploadFile, UploadProps } from "antd";

// Interface for props
interface ModalProps {
  open: boolean;
  onClose: () => void;
  UserID: number;
  onReviewCreated: (reviewId: number) => void; // Add this prop
}

const ModalCreate: React.FC<ModalProps> = ({
  open,
  onClose,
  UserID,
  onReviewCreated,
}) => {
  if (!open) return null;

  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = React.useState(false);
  const [rating, setRating] = React.useState<number | undefined>(undefined);
  const [fileList, setFileList] = React.useState<UploadFile[]>([]);

  // Handles file list change
  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  // Previews the file
  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as File); // Use File type
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  // Handles form submission
  const onFinish = async (values: ReviewInterface) => {
    if (rating === undefined || rating < 1) {
      messageApi.open({
        type: "warning",
        content: "กรุณาให้คะแนนหลักสูตร!",
      });
      return;
    }

    // Creating FormData to send to the API
    const formData = new FormData();
    formData.append("rating", rating.toString());
    formData.append("userID", UserID.toString());
    formData.append("comment", values.Comment || "");

    // Check if any file is selected
    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append("imageproduct", fileList[0].originFileObj as File); // Append the file
    }

    setLoading(true);
    try {
      const res = await CreateReview(formData);  // Send FormData to API
      if (res) { 
        messageApi.open({
          type: "success",
          content: "การรีวิวสำเร็จเเล้ว",
        });
        setTimeout(() => {
          onClose();
          onReviewCreated(res.id); 
          console.log(res.id)
          navigate("/zookeeper/myticket");
        }, 2000);
      } else {
        messageApi.open({
          type: "error",
          content: "การรีวิวไม่สำเร็จ",
        });
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "An error occurred!",
      });
    } finally {
      setLoading(false);
    }
  };

  return ReactDOM.createPortal(
    <>
      {contextHolder}
      <div className="overlay" />
      <div className="modal">
        <div>
          <p className="header-reviewszoo">Review Zoo</p>
          <Form
            form={form}
            name="reviewForm"
            onFinish={onFinish}
            layout="vertical"
          ><br />
            <Form.Item
              label="Picture"
              name="Profile"
              valuePropName="fileList"
            >
              <ImgCrop rotationSlider>
                <Upload
                  fileList={fileList}
                  onChange={onChange}
                  onPreview={onPreview}
                  beforeUpload={(file) => {
                    setFileList([...fileList, file]);
                    return false;
                  }}
                  maxCount={1}
                  multiple={false}
                  listType="picture-card"
                >
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>อัพโหลด</div>
                  </div>
                </Upload>
              </ImgCrop>
            </Form.Item>

            <Form.Item>
              <StarRating rating={rating ?? 0} onRatingChange={setRating} />
            </Form.Item>

            <Form.Item
              name="Comment"
              label="Review"
              rules={[{ required: true, message: "Please enter your review!" }]}

            >
              <Input.TextArea rows={4} style={{ width: "400px" }} />
            </Form.Item>

            <Form.Item className="box-button-reviews">
              <Button type="default" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                style={{ marginLeft: "8px" }}
                loading={loading}
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>,
    document.body
  );
};

export default ModalCreate;
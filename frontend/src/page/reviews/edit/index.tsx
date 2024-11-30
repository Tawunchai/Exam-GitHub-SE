import React, { useEffect, useState } from "react";
import { Form, Input, Button, message, Upload } from "antd";
import ReactDOM from "react-dom";
import { ReviewInterface } from "../../../interface/IReview";
import { UpdateReview, GetReviewsByID } from "../../../services/https/index";
import { useNavigate } from "react-router-dom";
import StarRating from "../../../feature/star";
import "../create/review-create.css";
import { PlusOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import type { UploadFile, UploadProps } from "antd";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  UserID: number;
  reviewId: number;
}

const ModalEdit: React.FC<ModalProps> = ({
  open,
  onClose,
  UserID,
  reviewId,
}) => {
  if (!open) return null;

  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState<number | undefined>(undefined);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [reviews, setReviews] = useState<ReviewInterface>();

  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as File);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const onFinish = async (values: ReviewInterface) => {
    if (rating === undefined || rating < 1) {
      messageApi.open({
        type: "warning",
        content: "กรุณาให้คะแนนรีวิว!",
      });
      return;
    }
    values.Rating = rating;

    const profileImage = fileList[0]?.originFileObj as File | undefined; // Use the actual file if available

    setLoading(true);
    try {
      const res = await UpdateReview(reviewId, values, profileImage);
      if (res) {
        messageApi.open({
          type: "success",
          content: "เเก้ไขรีวิวสำเร็จ",
        });
        setTimeout(() => {
          onClose();
          navigate("/zookeeper/myticket");
        }, 2000);
      } else {
        messageApi.open({
          type: "error",
          content: "เเก้ไขรีวิวไม่สำเร็จ!",
        });
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาด!",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const GetReviewById = async () => {
      const res = await GetReviewsByID(reviewId);
      if (res) {
        setReviews(res);
        form.setFieldsValue({
          Rating: res.Rating,
          Comment: res.Comment,
        });
        setRating(res.Rating);
        if (res.Picture) {
          setFileList([{
            uid: "-1",
            name: "profile.png",
            status: "done",
            url: `http://localhost:8000/${res.Picture}`, // URL of the existing image
          }]);
        }
      }
    };
    GetReviewById();
  }, [reviewId, form]);

  return ReactDOM.createPortal(
    <>
      {contextHolder}
      <div className="overlay" />
      <div className="modal">
        <div>
          <p className="header-reviewszoo">Edit Review</p>
          <Form
            form={form}
            name="reviewForm"
            onFinish={onFinish}
            layout="vertical"
          ><br />
            <Form.Item label="Picture" name="Picture" valuePropName="fileList">
              <ImgCrop aspect={1} rotationSlider>
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
                    <div style={{ marginTop: 8 }}>อัปโหลด</div>
                  </div>
                </Upload>
              </ImgCrop>
            </Form.Item>

            <Form.Item>
              <StarRating rating={rating ?? 0} onRatingChange={setRating} />
            </Form.Item>

            <Form.Item
              label="Review"
              name="Comment"
              rules={[{ required: true, message: "กรุณากรอกความคิดเห็น!" }]} >
              <Input.TextArea rows={4} style={{ width: "400px" }}/>
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

export default ModalEdit;

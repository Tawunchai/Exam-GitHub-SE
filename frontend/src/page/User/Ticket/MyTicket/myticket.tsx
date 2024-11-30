import React, { useState, useEffect } from "react";
import { message } from "antd";
import { listBookingsByUserID, listReviewsByUserID } from "../../../../services/https/index";
import ModalCreate from "../../../reviews/create";
import ModalEdit from "../../../reviews/edit"; 
import "../../../reviews/create/review-create.css";

const MyTicket = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false); 
  const [messageApi, contextHolder] = message.useMessage();
  const [uid, setUid] = useState<number>(9); 
  const [checkBookings, setCheckBookings] = useState<boolean>(false);
  const [reviewId, setReviewId] = useState<number | null>(null); 

  useEffect(() => {
    const fetchData = async () => {
      const bookings = await listBookingsByUserID(uid);
      if (bookings && bookings.length > 0) {
        setCheckBookings(true);
      }

      const reviews = await listReviewsByUserID(uid);
      if (reviews && reviews.length > 0) {
        setReviewId(reviews[0].ID ?? null); 
      }
    };
    fetchData();
  }, [uid]);

  const openModalCreate = () => setIsOpen(true);
  const openModalEdit = () => setIsEditOpen(true);

  const handleReviewCreated = (newReviewId: number) => {
    setReviewId(newReviewId); // Update reviewId to switch to "Edit Review"
    setIsOpen(false); // Close create modal
  };

  return (
    <>
      {contextHolder}
      <div className="review-layer">
        {checkBookings ? (
          reviewId ? (
            <button className="button-open-model" onClick={openModalEdit}>
              Edit Review
            </button>
          ) : (
            <button className="button-open-model" onClick={openModalCreate}>
              Create Review
            </button>
          )
        ) : (
          <div></div>
        )}

        {isOpen && <ModalCreate open={isOpen} onClose={() => setIsOpen(false)} UserID={uid}  onReviewCreated={handleReviewCreated} />}

        {isEditOpen && reviewId && (
          <ModalEdit
            open={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            UserID={uid}
            reviewId={reviewId}
          />
        )}
      </div>
    </>
  );
};

export default MyTicket;

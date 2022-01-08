import { MeQuery, useDeleteReviewMutation } from '../generated/graphql';

interface Props {
  review: {
    __typename?: 'Review' | undefined;
    id: number;
    title: string;
    rating: number;
    comment: string;
    productId: number;
    creatorId: number;
    createdAt: string;
    updatedAt: string;
  };
  user: MeQuery | undefined;
}

const ReviewCard = ({ review, user }: Props) => {
  const [, deleteReview] = useDeleteReviewMutation();
  return (
    <div className="p-2">
      <div className="bg-gray-100 p-4 rounded">
        <p className="leading-relaxed mb-6">{review.title}</p>
        <p className="leading-relaxed mb-6">{review.comment}</p>
        <a className="inline-flex items-center">
          <span className="flex-grow flex flex-col">
            <span className="title-font font-medium text-gray-900">
              Rating: {review.rating}/5
            </span>
            {user?.me?.id === review.creatorId && (
              <div className="flex flex-col align-left mt-5">
                <button
                  className="btn btn-red"
                  type="button"
                  onClick={async () => {
                    await deleteReview({
                      id: review.id,
                    });
                  }}
                >
                  Delete Review
                </button>
              </div>
            )}
          </span>
        </a>
      </div>
    </div>
  );
};
export default ReviewCard;

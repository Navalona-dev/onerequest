import React, {useState} from "react";
import { store } from "../../../store";
import { Link } from "react-router-dom";

const RegionComponent = () => {
  const [showModal, setShowModal] = useState(false);

  const state = store.getState();
  const { create, delete: deleteAction, edit, activate, deactivate } = state.actionTexts;

    return(
        <>
        <div className="h-[75vh] overflow-y-auto">
            <div className="color-header p-4 flex justify-between items-center mb-5">
              <h4 className="font-bold text-white">Liste région</h4>
              <div>
              <button
                onClick={() => setShowModal(true)}
                className="bg-red-500 px-5 py-1.5 text-white rounded mr-3"
              >
                {create.upperText}
              </button>
              <Link to={'/site'}
                className="bg-red-500 px-5 py-2 text-white rounded">
                Liste site
              </Link>

              </div>
            </div>
            <div className="overflow-x-auto w-[80vh] pl-4">
                table
            </div>
        </div>
        </>
    )
}

export default RegionComponent;
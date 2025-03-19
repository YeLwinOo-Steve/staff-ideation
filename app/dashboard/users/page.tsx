import React from "react";
import NavBar from "../components/navBar";

const Users = () => {
  return (
    <>
      <NavBar />
      <div>
        <div className="overflow-x-auto bg-base-100">
          <table className="table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Name</th>
                <th>Role</th>
                <th>Department</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  <th>
                    <label>{index + 1}.</label>
                  </th>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle h-12 w-12">
                          <img
                            src="https://img.daisyui.com/images/profile/demo/2@94.webp"
                            alt="Avatar Tailwind CSS Component"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">Hart Hagerty</div>
                        <div className="text-sm opacity-50">United States</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-accent badge-sm mr-2">
                      Administrator
                    </span>
                    <span className="badge badge-secondary badge-sm">
                      QA Manager
                    </span>
                  </td>
                  <td>QA Department</td>
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr>
                <td colSpan={5} className="text-center">
                  <div className="join">
                    <input
                      className="join-item btn btn-square"
                      type="radio"
                      name="options"
                      aria-label="1"
                    />
                    <input
                      className="join-item btn btn-square"
                      type="radio"
                      name="options"
                      aria-label="2"
                    />
                    <input
                      className="join-item btn btn-square"
                      type="radio"
                      name="options"
                      aria-label="3"
                    />
                    <input
                      className="join-item btn btn-square"
                      type="radio"
                      name="options"
                      aria-label="4"
                    />
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </>
  );
};

export default Users;

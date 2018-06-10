/*
 *not finish yet!!
 */
import React from 'react';

export const ModalMsg = ({ message, title }) => (
    <div className="modal fade" tabIndex="-1" role="dialog" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            {message}
          </div>
        </div>
      </div>
    </div>
);

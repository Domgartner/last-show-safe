function Head({ onAddNewClick }) {
    return (
        <div className="main-head">
            <hr className="top-bar"></hr>
            <header>
                <h1 className="main-title">The Last Show</h1>
                <div>
                    <p className="add-new-btn" onClick={onAddNewClick}>+ New Obituary</p>
                </div>
            </header>
        </div>
    )
}

export default Head;
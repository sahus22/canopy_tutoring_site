import React from 'react'

const FilterForm = (props) => {
    const { filterText, updateFilterText, selectedSubject, updateSelectedSubject, subjectList, onlyFavoriteTutors, setOnlyFavoriteTutors } = props;

    let subjectOptions = subjectList.map((subject, index) => <option key={index} value={subject}>{subject}</option>);

    const auth = JSON.parse(localStorage.getItem('user'));

    let onlyFavoriteTutorsCheckbox = <></>

    // only show the checkbox if the user is logged in
    if(auth && auth.user_id){
        onlyFavoriteTutorsCheckbox = (
        <>
            <input type='checkbox' 
                checked={onlyFavoriteTutors} 
                onChange={(event) => setOnlyFavoriteTutors(event.target.checked)}
                className='form-check-input' 
                id='only-favorite-tutors'/>
            <label htmlFor='only-favorite-tutors'>
                Only Show Favorites
            </label>
        </>)
    }

    return (
        <form className="d-flex">
            <input type='search'
                placeholder='Search Tutors...'
                className="form-control"
                style={{ maxWidth: '20em',margin:'0.3em'}}
                value={filterText}
                onChange={(event) => updateFilterText(event.target.value)} />

            <select className="form-select" style={{ maxWidth: '10em',margin:'0.3em'}} onChange={(event) => updateSelectedSubject(event.target.value)} defaultValue={selectedSubject}>
                <option value=''>Any</option>
                {subjectOptions}
            </select>

            {onlyFavoriteTutorsCheckbox}
        </form>
    )
}

export default FilterForm;
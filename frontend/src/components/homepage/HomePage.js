import React from 'react'

import Header from '../common/Header'
import Footer from '../common/Footer'
import FindTutors from '../find-tutors/FindTutors'
import Main from './Main'
import MyAppointments from '../appointments/MyAppointments'

const HomePage = (props) => {

    const [renderTutorPage, setrenderTutorPage] = React.useState(true)
    return (
        <>
            <Header updateRenderTutorPage={setrenderTutorPage} />
            <MainPage renderTutorPageValue={renderTutorPage} />
            <Footer />
        </>
    );
};

const MainPage = (props) => {
    const { renderTutorPageValue } = props;
    if (renderTutorPageValue)
        return (<><FindTutors /></>)
    else
        return(<MyAppointments/>)
}

export default HomePage;
import React from "react";
import ProfileImage from "../ProfileItemImage/ProfileImage";
import {Col, Container, Row} from "react-bootstrap";
import styles from "../ProfileItem.module.scss"
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ModalWindowContainer from "../../../common/Modal/ModalWindow";
import {EditProfileReduxForm, UploadImageReduxForm} from "../../ProfileForms/ProfileForms";
import {NavLink} from "react-router-dom";
import classNames from 'classnames';

const ProfileHeader = ({profile, authorisedUser, isCurrentUserAuthorised, status, updateImage, headerImages, updateProfile, isFetching}) => {
    const leftMenu = [
        {name: 'timeline', link: '', show: isCurrentUserAuthorised},
        {name: 'about', link: 'about', show: true}
    ]
    const rightMenu = [
        {name: 'friends', link: 'friends', show: isCurrentUserAuthorised},
        {name: 'users', link: '/users', show: true},
        {name: 'settings', show: isCurrentUserAuthorised}
    ]
    return (
        <Container>
            <Row>
                <Col>
                    <div className="uiBlock">
                        <div className={classNames(
                            {[styles.currentUserBg]: isCurrentUserAuthorised},
                            styles.profileBg)}
                        />
                        <div className={styles.profileSection}>
                            <Row>
                                <Col className="col col-lg-5 col-md-5 col-sm-12 col-12">
                                    <ProfileHeaderMenu menuItems={leftMenu}/>
                                </Col>
                                <Col className="col col-lg-5 ms-auto col-md-5 col-sm-12 col-12">
                                    <ProfileHeaderMenu updateProfile={updateProfile}
                                                       updateImage={updateImage}
                                                       authorisedUser={authorisedUser}
                                                       isFetching={isFetching}
                                                       menuItems={rightMenu}/>
                                </Col>
                            </Row>
                        </div>
                        <div className={styles.profileUser}>
                            <ProfileImage
                                image={authorisedUser && isCurrentUserAuthorised ? authorisedUser.photos.large : profile.photos.large}
                                classNames={styles.ava}/>
                            <div
                                className={`${styles.profileName} h4`}>{authorisedUser && isCurrentUserAuthorised ? authorisedUser.fullName : profile.fullName}</div>
                            <div className={styles.status}>{status}</div>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

const ProfileHeaderMenu = ({menuItems, updateProfile, updateImage, authorisedUser, isFetching}) => {

    return (
        <ul className={styles.profileMenu}>
            {menuItems.map(item => (
                item.show && <li key={item.name}>
                    {item.name === 'settings' ?
                        <ProfileSettings authorisedUser={authorisedUser}
                                         updateImage={updateImage}
                                         updateProfile={updateProfile}
                                         isFetching={isFetching}/>
                        :
                        <NavLink to={item.link}
                                 end
                                 className="profileHeaderMenuItem"
                        >{item.name}</NavLink>
                    }
                </li>
            ))
            }
        </ul>
    )
}

const ProfileSettings = ({authorisedUser, updateImage, updateProfile, isFetching}) => {
    const editProfileFormId = "editProfileForm";

    const {fullName, lookingForAJob, contacts, ...profileData} = authorisedUser || {};
    const [firstName, lastName] = fullName?.split(' ') || [];

    const profileObj = {
        firstName: firstName,
        lastName: lastName,
        lookingForAJob: lookingForAJob ? 'true' : 'false',
        ...contacts,
        ...profileData
    }

    const editProfile = (profile) => {
        const {
            firstName, lastName,
            facebook, github, instagram, mainLink, twitter, vk, website, youtube,
            ...profileData
        } = profile;

        const profileObj = {
            fullName: `${firstName} ${lastName}`,
            contacts: {facebook, github, instagram, mainLink, twitter, vk, website, youtube},
            ...profileData
        };

        updateProfile(profileObj)
    }

    return <div className="more btnControl">
        <MoreHorizIcon/>
        <ul className="moreDropdown moreWithTriangle triangleBottomRight">
            <li>
                <ModalWindowContainer text="Update Profile Photo"
                                      dependency={authorisedUser}>
                    <UploadImageReduxForm updateImage={updateImage}
                                          isFetching={isFetching}/>
                </ModalWindowContainer>
            </li>
            <li>
                <a href="#" data-bs-toggle="modal" data-bs-target="#update-header-photo">Update
                    Header Photo</a>
            </li>
            <li>
                <ModalWindowContainer text="Edit Personal Info"
                                      formId={editProfileFormId}
                                      dependency={authorisedUser}
                                      submitBtnText="Save all Changes">
                    <EditProfileReduxForm initialValues={profileObj}
                                          onSubmit={editProfile}
                                          formId={editProfileFormId}
                                          authorisedUser={authorisedUser}
                                          isFetching={isFetching}/>
                </ModalWindowContainer>
            </li>
        </ul>
    </div>
}

export default ProfileHeader

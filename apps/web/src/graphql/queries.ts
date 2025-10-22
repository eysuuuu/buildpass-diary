import { gql } from '@apollo/client';

export const SITE_DIARIES = gql`
  query SiteDiaries {
    siteDiaries {
      id
      date
      title
      content
      createdBy
      weather {
        temperature
        description
      }
      attendees
      attachments
    }
  }
`;

export const SITE_DIARY = gql`
  query SiteDiary($id: String!) {
    siteDiary(id: $id) {
      id
      date
      title
      content
      createdBy
      weather {
        temperature
        description
      }
      attendees
      attachments
    }
  }
`;
export const SITE_DIARY_MINIMAL = gql`
  query SiteDiary($id: String!) {
    siteDiary(id: $id) {
      id
      date
      title
      content
      createdBy
    }
  }
`;
export const CREATE_SITE_DIARY = gql`
  mutation CreateSiteDiary($input: SiteDiaryInput!) {
    createSiteDiary(input: $input) {
      id
      date
      title
      content
      createdBy
      weather {
        temperature
        description
      }
      attendees
      attachments
    }
  }
`;

import type { Schema, Struct } from '@strapi/strapi';

export interface FirstNameContactInfo extends Struct.ComponentSchema {
  collectionName: 'components_first_name_contact_infos';
  info: {
    displayName: 'ContactInfo';
  };
  attributes: {};
}

export interface SharedAddress extends Struct.ComponentSchema {
  collectionName: 'components_shared_addresses';
  info: {
    displayName: 'address';
  };
  attributes: {
    city: Schema.Attribute.String & Schema.Attribute.Required;
    Country: Schema.Attribute.String & Schema.Attribute.Required;
    Number: Schema.Attribute.Integer & Schema.Attribute.Required;
    Street: Schema.Attribute.String & Schema.Attribute.Required;
    zipCode: Schema.Attribute.String;
  };
}

export interface SharedContactInfo extends Struct.ComponentSchema {
  collectionName: 'components_shared_contact_infos';
  info: {
    displayName: 'ContactInfo';
  };
  attributes: {
    address: Schema.Attribute.Component<'shared.address', false>;
    emailAddress: Schema.Attribute.Email & Schema.Attribute.Required;
    FirstName: Schema.Attribute.String & Schema.Attribute.Required;
    lastName: Schema.Attribute.String & Schema.Attribute.Required;
    Phone: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'first-name.contact-info': FirstNameContactInfo;
      'shared.address': SharedAddress;
      'shared.contact-info': SharedContactInfo;
    }
  }
}

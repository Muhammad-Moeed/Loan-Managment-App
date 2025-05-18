import React, { useEffect, useState, useContext } from 'react';
import { Typography, Avatar, Input, Button, Space, Upload, message, Spin, Divider } from 'antd';
import { EditOutlined, UploadOutlined, SaveOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons';
import supabase from '../services/supabaseClient';
import { AuthContext } from '../context/AuthContext';

const { Title, Text } = Typography;

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    email: '',
    avatar_url: ''
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Keep all existing backend logic
  const fetchProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('first_name, last_name, email, avatar_url')
      .eq('id', user.id)
      .single();

    if (data) {
      setProfile(data);
    } else if (error) {
      message.error('Failed to load profile');
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const handleUpdate = async () => {
    setSaving(true);

    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: profile.first_name,
        last_name: profile.last_name
      })
      .eq('id', user.id);

    if (!error) {
      message.success('Profile updated successfully');
      setEditing(false);
      fetchProfile();
    } else {
      message.error('Update failed');
    }

    setSaving(false);
  };

  const handleImageUpload = async (file) => {
    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      message.error('Failed to upload image');
      console.error('Upload Error:', uploadError);
      return false;
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    const publicUrl = data.publicUrl;

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', user.id);

    if (updateError) {
      message.error('Failed to update avatar');
      console.error('Avatar Update Error:', updateError);
    } else {
      setProfile(prev => ({ ...prev, avatar_url: publicUrl }));
      message.success('Profile picture updated');
    }

    return false;
  };

  if (loading) return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      backgroundColor: '#f0f2f5'
    }}>
      <Spin indicator={<div className="custom-spinner" />} size="large" />
    </div>
  );

  return (
    <div style={{
      backgroundColor: 'black',
      minHeight: '100vh',
      fontFamily: 'Segoe UI Historic, Segoe UI, Helvetica, Arial, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#ffffff',
        height: '56px',
        padding: '0 16px',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: '#1877f2',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '20px',
            marginRight: '10px'
          }}>
            L
          </div>
          <Text strong style={{ fontSize: '20px' }}>LoanPro</Text>
        </div>
        <div style={{ width: '40px' }}></div> 
      </header>

      {/* Cover Photo */}
      <div style={{
        height: '350px',
        backgroundColor: '#e7f3ff',
        position: 'relative',
        marginBottom: '100px',
      }}>
        <div style={{
          position: 'absolute',
          bottom: '-80px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          width: '100%',
          maxWidth: '900px',
          padding: '0 20px'
        }}>
          <Avatar
            size={164}
            src={profile.avatar_url || undefined}
            style={{
              border: '4px solid white',
              backgroundColor: '#e9ebee',
              fontSize: '72px',
              fontWeight: 'bold',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              marginBottom: '16px'
            }}
          >
            {profile.first_name?.[0]?.toUpperCase() || '?'}
          </Avatar>
          
          <Title level={2} style={{ 
            margin: 0,
            color: '#050505',
            fontWeight: 700,
            fontSize: '32px'
          }}>
            {profile.first_name} {profile.last_name}
          </Title>
          
          <Text style={{ 
            color: '#65676b',
            margin: '8px 0 16px',
            fontSize: '17px'
          }}>
            Premium Member
          </Text>
          
          <Upload beforeUpload={handleImageUpload} showUploadList={false}>
            <Button
              icon={<UploadOutlined />}
              style={{
                backgroundColor: '#ffb300',
                color: '#050505',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 600,
                padding: '8px 16px',
                height: '36px',
                fontSize: '15px'
              }}
            >
              Update Photo
            </Button>
          </Upload>
        </div>
      </div>

      {/* Main Content */}
      <main style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '0 20px 40px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {/* Profile Card */}
        <div style={{
          backgroundColor: '#ffb300',
          borderRadius: '8px',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
          padding: '20px',
          position: 'relative'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <Title level={4} style={{ 
              margin: 0, 
              color: '#050505',
              fontSize: '20px'
            }}>Profile Information</Title>
            
            {!editing ? (
              <Button
                icon={<EditOutlined />}
                onClick={() => setEditing(true)}
                style={{
                  backgroundColor: 'black',
                  color: '#ffb300',
                  border: 'none',
                  borderRadius: '6px',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              />
            ) : (
              <Button
                icon={<CloseOutlined />}
                onClick={() => setEditing(false)}
                style={{
                  backgroundColor: 'black',
                  color: '#ffb300',
                  border: 'none',
                  borderRadius: '6px',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              />
            )}
          </div>

          {editing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <Text strong style={{ 
                  display: 'block', 
                  marginBottom: '8px',
                  color: 'black',
                  fontSize: '15px'
                }}>First Name</Text>
                <Input
                  value={profile.first_name}
                  onChange={e => setProfile({ ...profile, first_name: e.target.value })}
                  style={{ 
                    borderRadius: '6px',
                    height: '40px',
                    fontSize: '15px',
                    borderColor: '#ced0d4',
                    backgroundColor: 'black',
                    color: '#ffb300'
                  }}
                />
              </div>
              
              <div>
                <Text strong style={{ 
                  display: 'block', 
                  marginBottom: '8px',
                  color: 'black',
                  fontSize: '15px'
                }}>Last Name</Text>
                <Input
                  value={profile.last_name}
                  onChange={e => setProfile({ ...profile, last_name: e.target.value })}
                  style={{ 
                    borderRadius: '6px',
                    height: '40px',
                    fontSize: '15px',
                    borderColor: '#ced0d4',
                    backgroundColor: 'black',
                    color: '#ffb300'
                  }}
                />
              </div>
              
              <div>
                <Text strong style={{ 
                  display: 'block', 
                  marginBottom: '8px',
                  color: 'black',
                  fontSize: '15px'
                }}>Email</Text>
                <Input
                  value={profile.email}
                  disabled
                  style={{ 
                    borderRadius: '6px',
                    height: '40px',
                    fontSize: '15px',
                    backgroundColor: 'black',
                    color: '#ffb300',
                    borderColor: '#ced0d4'
                  }}
                />
              </div>

              <div style={{ 
                display: 'flex', 
                gap: '10px', 
                justifyContent: 'flex-end',
                marginTop: '16px',
                borderTop: '1px solid #ddd',
                paddingTop: '20px'
              }}>
                <Button
                  onClick={() => setEditing(false)}
                  style={{
                    backgroundColor: 'black',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 600,
                    height: '36px',
                    padding: '0 16px',
                    fontSize: '15px'
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={handleUpdate}
                  loading={saving}
                  style={{
                    backgroundColor: 'black',
                    borderRadius: '6px',
                    fontWeight: 600,
                    height: '36px',
                    padding: '0 16px',
                    fontSize: '15px'
                  }}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '20px'
            }}>
              <div>
                <Text strong style={{ 
                  display: 'block', 
                  color: '#65676b',
                  fontSize: '15px',
                  marginBottom: '4px'
                }}>First Name</Text>
                <Text style={{ fontSize: '17px' }}>{profile.first_name}</Text>
              </div>
              
              <div>
                <Text strong style={{ 
                  display: 'block', 
                  color: '#65676b',
                  fontSize: '15px',
                  marginBottom: '4px'
                }}>Last Name</Text>
                <Text style={{ fontSize: '17px' }}>{profile.last_name}</Text>
              </div>
              
              <div>
                <Text strong style={{ 
                  display: 'block', 
                  color: '#65676b',
                  fontSize: '15px',
                  marginBottom: '4px'
                }}>Email</Text>
                <Text style={{ fontSize: '17px' }}>{profile.email}</Text>
              </div>
              
              <div>
                <Text strong style={{ 
                  display: 'block', 
                  color: '#65676b',
                  fontSize: '15px',
                  marginBottom: '4px'
                }}>Member ID</Text>
                <Text style={{ fontSize: '17px' }}>LP-{user.id.slice(0, 8)}</Text>
              </div>
            </div>
          )}
        </div>

        {/* Verification Status Card */}
        <div style={{
          backgroundColor: '#ffb300',
          borderRadius: '8px',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
          padding: '20px'
        }}>
          <Title level={4} style={{ 
            marginBottom: '16px', 
            color: '#050505',
            fontSize: '20px'
          }}>Account Verification</Title>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px',
            backgroundColor: 'black',
            borderRadius: '8px',
            marginBottom: '12px'
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: '#31a24c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckOutlined style={{ color: 'white', fontSize: '12px' }} />
            </div>
            <div>
              <Text strong style={{ 
                color: 'white',
                fontSize: '15px'
              }}>Identity Verified</Text>
              <Text style={{ 
                display: 'block', 
                color: '#ffb300',
                fontSize: '13px'
              }}>Your identity has been confirmed</Text>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px',
            backgroundColor: 'black',
            borderRadius: '8px'
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: '#31a24c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckOutlined style={{ color: 'white', fontSize: '12px' }} />
            </div>
            <div>
              <Text strong style={{ 
                color: 'white',
                fontSize: '15px'
              }}>Email Verified</Text>
              <Text style={{ 
                display: 'block', 
                color: '#ffb300',
                fontSize: '13px'
              }}>{profile.email}</Text>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
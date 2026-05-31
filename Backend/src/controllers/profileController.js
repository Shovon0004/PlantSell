import User from '../models/User.js';

// @desc    View user profile
// @route   GET /api/profile
// @access  Private
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile details
// @route   PUT /api/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Handle updates
    if (req.body.name) user.name = req.body.name;
    if (req.body.email && req.body.email !== user.email) {
      const emailExists = await User.findOne({ email: req.body.email });
      if (emailExists) {
        res.status(400);
        throw new Error('Email is already taken');
      }
      user.email = req.body.email;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        addresses: updatedUser.addresses
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change user password
// @route   PUT /api/profile/change-password
// @access  Private
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400);
      throw new Error('Current password and new password are required');
    }

    const user = await User.findById(req.user._id);

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      res.status(401);
      throw new Error('Incorrect current password');
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Reset other addresses default status
const handleDefaultAddress = (addresses, newAddressId, makeDefault) => {
  if (makeDefault) {
    addresses.forEach(addr => {
      if (addr._id.toString() !== newAddressId.toString()) {
        addr.isDefault = false;
      }
    });
  }
};

// @desc    Add a delivery address
// @route   POST /api/profile/address
// @access  Private
export const addAddress = async (req, res, next) => {
  try {
    const { street, city, state, zipCode, country, isDefault = false } = req.body;

    const user = await User.findById(req.user._id);

    const shouldBeDefault = user.addresses.length === 0 ? true : isDefault;

    user.addresses.push({ street, city, state, zipCode, country, isDefault: shouldBeDefault });

    const savedUser = await user.save();
    const addedAddress = savedUser.addresses[savedUser.addresses.length - 1];

    if (shouldBeDefault) {
      handleDefaultAddress(savedUser.addresses, addedAddress._id, true);
      await savedUser.save();
    }

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      data: savedUser.addresses
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an address
// @route   PUT /api/profile/address/:id
// @access  Private
export const updateAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { street, city, state, zipCode, country, isDefault } = req.body;

    const user = await User.findById(req.user._id);
    const address = user.addresses.id(id);

    if (!address) {
      res.status(404);
      throw new Error('Address not found');
    }

    if (street !== undefined) address.street = street;
    if (city !== undefined) address.city = city;
    if (state !== undefined) address.state = state;
    if (zipCode !== undefined) address.zipCode = zipCode;
    if (country !== undefined) address.country = country;

    if (isDefault !== undefined) {
      address.isDefault = isDefault;
      if (isDefault === true) {
        handleDefaultAddress(user.addresses, address._id, true);
      }
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      data: user.addresses
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an address
// @route   DELETE /api/profile/address/:id
// @access  Private
export const deleteAddress = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(req.user._id);

    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === id);
    if (addressIndex === -1) {
      res.status(404);
      throw new Error('Address not found');
    }

    const wasDefault = user.addresses[addressIndex].isDefault;
    user.addresses.splice(addressIndex, 1);

    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Address deleted successfully',
      data: user.addresses
    });
  } catch (error) {
    next(error);
  }
};

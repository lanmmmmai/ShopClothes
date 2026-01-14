import React, {useState} from "react";

import { useNavigate } from "react-router-dom";
export default (props) => {
	const [input1, onChangeInput1] = useState('');
	const [input2, onChangeInput2] = useState('');
	const [input3, onChangeInput3] = useState('');
	const [input4, onChangeInput4] = useState('');
	const navigate = useNavigate();
	return (
		<div className="min-h-screen w-full bg-black overflow-x-hidden">
			<div className="flex min-h-screen w-full bg-black">
				<div className="flex w-full min-h-screen items-stretch">
					<div className="flex flex-col shrink-0 w-72 items-start bg-black p-5 gap-5">
						<div className="flex items-center px-[26px] gap-2.5">
							<img
								src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/P05VHaagEL/f50xqgnt_expires_30_days.png"} 
								className="w-8 h-8 object-fill"
							/>
							<span className="text-white text-xl font-bold" >
								{"Clothes"}
							</span>
						</div>
						<div className="flex flex-col items-start gap-5">
							<div className="flex flex-col items-start">
								<div className="flex flex-col items-start py-[17px] px-1.5 w-full">
									<span className="text-white text-xs" >
										{"DISCOVER"}
									</span>
								</div>
								<div className="flex items-start bg-black py-2 px-1.5 mr-3 gap-2.5 rounded-[10px]">
									<img
										src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/P05VHaagEL/aqpcm8ka_expires_30_days.png"} 
										className="w-6 h-6 rounded-[10px] object-fill"
									/>
									<span className="text-white text-base" >
										{"Trang Chủ"}
									</span>
									<div className="w-6 h-6">
									</div>
								</div>
							</div>
							<div className="flex flex-col items-start gap-2.5">
								<div className="flex flex-col items-start px-1.5 w-full">
									<span className="text-white text-xs" >
										{"HÀNG TỒN KHO"}
									</span>
								</div>
								<div className="flex flex-col items-start pb-[131px]">
									<div className="flex items-start bg-black py-2 rounded-[10px] cursor-pointer" role="button" tabIndex={0} onClick={()=>navigate("/products")}>
										<img
											src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/P05VHaagEL/ca3p6k8d_expires_30_days.png"} 
											className="w-6 h-6 ml-1.5 mr-2.5 rounded-[10px] object-fill"
										/>
										<span className="text-white text-base mr-5" >
											{"Các Sản Phẩm"}
										</span>
									</div>
									<div className="flex items-start py-2 mb-2.5 rounded-lg cursor-pointer" role="button" tabIndex={0} onClick={()=>navigate("/report")}>
										<img
											src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/P05VHaagEL/tyardlu0_expires_30_days.png"} 
											className="w-6 h-6 ml-1.5 mr-2.5 rounded-lg object-fill"
										/>
										<span className="text-white text-base mr-[67px]" >
											{"Báo Cáo"}
										</span>
									</div>
									<div className="flex items-start py-2 mb-2.5 rounded-lg cursor-pointer" role="button" tabIndex={0} onClick={()=>navigate("/schedule")}>
										<img
											src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/P05VHaagEL/jhqtshvt_expires_30_days.png"} 
											className="w-6 h-6 ml-1.5 mr-2.5 rounded-lg object-fill"
										/>
										<span className="text-white text-base mr-[62px]" >
											{"Lịch Trình"}
										</span>
									</div>
									<div className="flex items-start bg-black py-2 px-1.5 mb-2.5 gap-2.5 rounded-[10px] cursor-pointer" role="button" tabIndex={0} onClick={()=>navigate("/customers")}>
										<img
											src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/P05VHaagEL/um7qfik0_expires_30_days.png"} 
											className="w-6 h-6 rounded-[10px] object-fill"
										/>
										<span className="text-white text-base" >
											{"Khách Hàng"}
										</span>
										<div className="w-6 h-6 cursor-pointer" role="button" tabIndex={0} onClick={()=>navigate("/settings")}>
										</div>
									</div>
									<div className="flex items-center bg-black mb-[131px] rounded-[10px]">
										<img
											src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/P05VHaagEL/z7ao3jdr_expires_30_days.png"} 
											className="w-[22px] h-[22px] ml-1.5 mr-2.5 rounded-[10px] object-fill"
										/>
										<span className="text-white text-base mr-5">{"Cài Đặt"}</span>
									</div>
								</div>
							</div>
						</div>
						<div className="flex items-center pt-[260px]">
							<div className="flex shrink-0 items-center gap-2.5">
								<img
									src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/P05VHaagEL/yxbl85su_expires_30_days.png"} 
									className="w-10 h-10 object-fill"
								/>
								<div className="flex flex-col shrink-0 items-start gap-0.5">
									<span className="text-white text-[11px] font-bold" >
										{"Lương Đức Thành"}
									</span>
									<span className="text-[#757575] text-xs mr-[52px]" >
										{"Thu ngân"}
									</span>
								</div>
							</div>
							<img
								src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/P05VHaagEL/gsetyfsv_expires_30_days.png"} 
								className="w-5 h-5 object-fill"
							/>
						</div>
					</div>
					<div className="flex-1 bg-neutral-100 rounded-xl">
						<div className="flex justify-between items-start self-stretch p-5">
							<span className="text-black text-2xl font-bold" >
								{"Cài đặt"}
							</span>
							<div className="w-[222px] h-9">
							</div>
						</div>
						<div className="flex items-start self-stretch pb-5 px-5 gap-5">
							<div className="flex flex-col shrink-0 items-start bg-white pt-5 px-5 rounded-[10px] border border-solid border-[#E5E5EA]">
								<div className="flex flex-col items-start bg-[#7676801C] py-2.5 pl-2.5 pr-[69px] mb-5 rounded-[10px]">
									<span className="text-black text-base" >
										{"Thông tin tài khoản"}
									</span>
								</div>
								<div className="flex flex-col items-start py-2.5 pl-2.5 pr-[85px] mb-5 rounded-[10px]">
									<span className="text-black text-base" >
										{"Trung tâm hỗ trợ"}
									</span>
								</div>
								<div className="flex flex-col items-start py-2.5 pl-2.5 pr-[71px] mb-[605px] rounded-[10px]">
									<span className="text-black text-base" >
										{"Điều khoản dịch vụ"}
									</span>
								</div>
							</div>
							<div className="flex-1 bg-white py-[25px] px-5 rounded-[10px] border border-solid border-[#E5E5EA]">
								<div className="flex items-start self-stretch gap-2.5">
									<div className="flex flex-1 flex-col items-start mb-5 gap-2.5">
										<span className="text-black text-xl font-bold" >
											{"Thông tin tài khoản"}
										</span>
										<span className="text-[#7E7E7E] text-base" >
											{"Cập nhật ảnh và thông tin cá nhân của bạn tại đây."}
										</span>
									</div>
									<div className="flex flex-1 justify-end items-start mt-3.5 gap-2.5">
										<button className="flex flex-col shrink-0 items-start bg-transparent text-left py-1.5 px-2.5 rounded-md border border-solid border-black"
											onClick={()=>alert("Pressed!")}>
											<span className="text-black text-base" >
												{"Hủy bỏ"}
											</span>
										</button>
										<button className="flex flex-col shrink-0 items-start bg-black text-left py-1.5 px-2.5 rounded-md border border-solid border-black"
											onClick={()=>alert("Pressed!")}>
											<span className="text-white text-base" >
												{"Lưu thay đổi"}
											</span>
										</button>
									</div>
								</div>
								<div className="flex items-center self-stretch py-5 gap-2.5">
									<div className="flex flex-1 flex-col items-start gap-1.5">
										<span className="text-black text-base font-bold" >
											{"Ảnh của bạn"}
										</span>
										<span className="text-[#7E7E7E] text-base" >
											{"Điều này sẽ được hiển thị trên hồ sơ của bạn."}
										</span>
									</div>
									<div className="flex flex-1 flex-col items-center py-[50px] gap-2.5 rounded-[10px] border-2 border-solid border-[#0000001C]">
										<img
											src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/P05VHaagEL/axck1224_expires_30_days.png"} 
											className="w-[30px] h-[30px] rounded-[10px] object-fill"
										/>
										<div className="flex flex-col items-start">
											<span className="text-black text-base font-bold" >
												{"Bấm để tải lên"}
											</span>
											<span className="text-black text-base ml-[114px]" >
												{"hoặc kéo và thả"}
											</span>
											<span className="text-[#7E7E7E] text-sm" >
												{"SVG, PNG hoặc JPG (tối đa 800x400px)"}
											</span>
										</div>
									</div>
								</div>
								<div className="flex justify-between items-center self-stretch py-5">
									<span className="text-black text-base font-bold" >
										{"Tên"}
									</span>
									<div className="flex shrink-0 items-start gap-5">
										<div className="flex flex-col shrink-0 items-start gap-1.5">
											<span className="text-[#7E7E7E] text-base mr-[169px]" >
												{"Tên"}
											</span>
											<input
												placeholder={"Duoc"}
												value={input2}
												onChange={(event)=>onChangeInput2(event.target.value)}
												className="text-black bg-white text-base p-2.5 rounded-md border-2 border-solid border-[#0000001C]"
											/>
										</div>
										<div className="flex flex-col shrink-0 items-start gap-1.5">
											<span className="text-[#7E7E7E] text-base mr-[178px]" >
												{"Họ"}
											</span>
											<input
												placeholder={"Le Tien"}
												value={input3}
												onChange={(event)=>onChangeInput3(event.target.value)}
												className="text-black bg-white text-base p-2.5 rounded-md border-2 border-solid border-[#0000001C]"
											/>
										</div>
									</div>
								</div>
								<div className="flex justify-between items-center self-stretch py-5">
									<span className="text-black text-base font-bold" >
										{"Địa chỉ email"}
									</span>
									<input
										placeholder={"letienduoc5@gmail.com"}
										value={input4}
										onChange={(event)=>onChangeInput4(event.target.value)}
										className="shrink-0 text-black bg-white text-base p-2.5 rounded-md border-2 border-solid border-[#0000001C]"
									/>
								</div>
								<div className="flex justify-between items-center self-stretch py-5">
									<span className="text-black text-base font-bold" >
										{"Số điện thoại"}
									</span>
									<div className="flex shrink-0 items-center bg-white p-2.5 rounded-md border-2 border-solid border-[#0000001C]">
										<div className="flex flex-col shrink-0 items-start pr-[196px] mr-[76px]">
											<span className="text-black text-base" >
												{"0325278009"}
											</span>
										</div>
										<img
											src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/P05VHaagEL/h1f615e1_expires_30_days.png"} 
											className="w-6 h-6 rounded-md object-fill"
										/>
									</div>
								</div>
								<div className="flex justify-between items-center self-stretch py-5">
									<span className="text-black text-base font-bold" >
										{"Địa chỉ"}
									</span>
									<button className="flex shrink-0 items-center bg-white text-left p-2.5 rounded-md border-2 border-solid border-[#0000001C]"
										onClick={()=>alert("Pressed!")}>
										<span className="text-black text-sm mr-[196px]" >
											{"Phu Lam, Ha Dong, Ha Noi"}
										</span>
										<img
											src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/P05VHaagEL/fq5ty8ej_expires_30_days.png"} 
											className="w-6 h-6 rounded-md object-fill"
										/>
									</button>
								</div>
								<div className="flex justify-between items-center self-stretch py-5">
									<span className="text-black text-base font-bold" >
										{"Mật khẩu"}
									</span>
									<button className="flex shrink-0 items-center bg-white text-left p-2.5 rounded-md border-2 border-solid border-[#0000001C]"
										onClick={()=>alert("Pressed!")}>
										<span className="text-black text-sm mr-[316px]" >
											{"staff123"}
										</span>
										<img
											src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/P05VHaagEL/w9dpzvaw_expires_30_days.png"} 
											className="w-6 h-6 rounded-md object-fill"
										/>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}